import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DOMParser } from '@xmldom/xmldom';
import { parseKml } from '../src/services/kml.ts';
const document = (body) =>
  '<kml xmlns="http://www.opengis.net/kml/2.2"><Document>' + body + '</Document></kml>';
const placemark = (body) => '<Placemark><name>Test &amp; site</name>' + body + '</Placemark>';
const parse = (text) => parseKml(text, DOMParser);
test('KML converts longitude/latitude/altitude without reversing coordinates', () => {
  const result = parse(
    document(placemark('<Point><coordinates>85.4,27.6,40</coordinates></Point>')),
  );
  assert.deepEqual(result.geojson.features[0].geometry, {
    type: 'Point',
    coordinates: [85.4, 27.6, 40],
  });
  assert.equal(result.geojson.features[0].properties.name, 'Test & site');
});
test('KML imports multi geometry and polygon holes', () => {
  const polygon =
    '<Polygon><outerBoundaryIs><LinearRing><coordinates>85,27 86,27 86,28 85,27</coordinates></LinearRing></outerBoundaryIs><innerBoundaryIs><LinearRing><coordinates>85.1,27.1 85.2,27.1 85.2,27.2 85.1,27.1</coordinates></LinearRing></innerBoundaryIs></Polygon>';
  const result = parse(
    document(
      placemark(
        '<MultiGeometry><LineString><coordinates>85,27 86,28</coordinates></LineString>' +
          polygon +
          '</MultiGeometry>',
      ),
    ),
  );
  assert.equal(result.geojson.features[0].geometry.type, 'GeometryCollection');
  assert.equal(result.geojson.features[0].geometry.geometries[1].coordinates.length, 2);
});
test('KML rejects invalid coordinates, open polygons, empty documents, and entities', () => {
  for (const points of ['181,27', '85,91', 'NaN,27', '85,', '85'])
    assert.throws(
      () => parse(document(placemark('<Point><coordinates>' + points + '</coordinates></Point>'))),
      /invalid/,
    );
  assert.throws(
    () =>
      parse(
        document(
          placemark(
            '<Polygon><outerBoundaryIs><LinearRing><coordinates>85,27 86,27 86,28 85,28</coordinates></LinearRing></outerBoundaryIs></Polygon>',
          ),
        ),
      ),
    /closed/,
  );
  assert.throws(() => parse(document('')), /No usable/);
  assert.throws(
    () => parse('<!DOCTYPE kml [<!ENTITY x SYSTEM "file:///test">]>' + document('')),
    /entities/,
  );
  assert.throws(() => parse(document(placemark('<Model/>'))), /Unsupported/);
});
test('KML does not follow network links or render description markup', () => {
  const result = parse(
    document(
      '<NetworkLink><Link><href>https://example.com/remote.kml</href></Link></NetworkLink>' +
        placemark(
          '<description><![CDATA[<script>alert(1)</script>]]></description><Point><coordinates>85,27</coordinates></Point>',
        ),
    ),
  );
  assert.equal(result.warnings.length, 1);
  assert.deepEqual(Object.keys(result.geojson.features[0].properties), ['name']);
});
