import type { FeatureCollection, Geometry, Position } from 'geojson';
export const MAX_KML_BYTES = 5 * 1024 * 1024;
const descendants = (element: Element | Document, name: string): Element[] =>
  Array.from(element.getElementsByTagNameNS('*', name));
const children = (element: Element) =>
  Array.from(element.childNodes).filter((node): node is Element => node.nodeType === 1);
function coordinates(element: Element): Position[] {
  const text = descendants(element, 'coordinates')[0]?.textContent?.trim();
  if (!text) throw new Error('Geometry is missing coordinates.');
  return text.split(/\s+/).map((tuple) => {
    const parts = tuple.split(',');
    const point = parts.map(Number);
    if (
      parts.length < 2 ||
      parts.length > 3 ||
      parts.some((part) => !part.trim()) ||
      point.some((value) => !Number.isFinite(value)) ||
      Math.abs(point[0]) > 180 ||
      Math.abs(point[1]) > 90
    )
      throw new Error('KML contains invalid longitude/latitude coordinates.');
    return point;
  });
}
function ring(element: Element) {
  const points = coordinates(element);
  if (points.length < 4 || points[0][0] !== points.at(-1)![0] || points[0][1] !== points.at(-1)![1])
    throw new Error('Polygon rings must have at least four coordinates and be closed.');
  return points;
}
function geometry(element: Element): Geometry {
  switch (element.localName) {
    case 'Point': {
      const points = coordinates(element);
      if (points.length !== 1) throw new Error('A Point must contain one coordinate.');
      return { type: 'Point', coordinates: points[0] };
    }
    case 'LineString': {
      const points = coordinates(element);
      if (points.length < 2) throw new Error('A line needs at least two coordinates.');
      return { type: 'LineString', coordinates: points };
    }
    case 'Polygon': {
      const outer = descendants(element, 'outerBoundaryIs')[0];
      if (!outer) throw new Error('Polygon is missing its outer boundary.');
      return {
        type: 'Polygon',
        coordinates: [ring(outer), ...descendants(element, 'innerBoundaryIs').map(ring)],
      };
    }
    case 'MultiGeometry': {
      const parts = children(element).map(geometry);
      if (!parts.length) throw new Error('MultiGeometry is empty.');
      return { type: 'GeometryCollection', geometries: parts };
    }
    default:
      throw new Error(
        'Unsupported KML geometry: ' +
          element.localName +
          '. Use Point, LineString, Polygon, or MultiGeometry.',
      );
  }
}
export function parseKml(
  text: string,
  Parser: typeof DOMParser = DOMParser,
): { geojson: FeatureCollection; warnings: string[] } {
  if (new TextEncoder().encode(text).length > MAX_KML_BYTES)
    throw new Error('KML must be 5 MB or smaller.');
  if (/<!DOCTYPE|<!ENTITY/i.test(text))
    throw new Error('KML declarations with external entities are not supported.');
  const document = new Parser().parseFromString(text, 'application/xml');
  if (descendants(document, 'parsererror').length || document.documentElement?.localName !== 'kml')
    throw new Error('Choose a valid .kml XML document.');
  const placemarks = descendants(document, 'Placemark');
  if (placemarks.length > 2000)
    throw new Error('A KML upload can contain at most 2,000 placemarks.');
  const warnings: string[] = [];
  if (descendants(document, 'NetworkLink').length)
    warnings.push('Network links are ignored; only geometry inside this file is imported.');
  const features = placemarks.flatMap((placemark, index) => {
    const shape = children(placemark).find((child) =>
      ['Point', 'LineString', 'Polygon', 'MultiGeometry', 'Track', 'MultiTrack', 'Model'].includes(
        child.localName,
      ),
    );
    if (!shape) {
      warnings.push('Placemark ' + (index + 1) + ' has no supported geometry and was skipped.');
      return [];
    }
    return [
      {
        type: 'Feature' as const,
        geometry: geometry(shape),
        properties: {
          name: (descendants(placemark, 'name')[0]?.textContent || 'Feature ' + (index + 1)).slice(
            0,
            200,
          ),
        },
      },
    ];
  });
  if (!features.length) throw new Error('No usable geometry was found in this KML.');
  return { geojson: { type: 'FeatureCollection', features }, warnings };
}
