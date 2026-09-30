import assert from 'node:assert/strict';
import { test } from 'node:test';
import { render } from '../dist/server/entry-server.mjs';
import { readFileSync } from 'node:fs';

test('all public pages render meaningful content without a browser', () => {
  for (const path of [
    '/',
    '/about',
    '/company-profile',
    '/services',
    '/projects',
    '/team',
    '/news',
    '/gallery',
    '/downloads',
    '/careers',
    '/faq',
    '/contact',
    '/privacy',
    '/terms',
  ]) {
    const page = render(path);
    assert.equal(page.status, 200, path);
    assert.match(page.html, /<h1(?:\s|>)/, path);
    assert.match(page.html, /<main/, path);
    assert.doesNotMatch(page.html, /Loading secure workspace/, path);
  }
});
test('detail pages and unknown content have correct status', () => {
  for (const path of [
    '/service/feasibility-studies',
    '/project/kabeli-b-hep',
    '/news-event/breakthrough-upper-kabeli-hydropower-tunnel',
  ])
    assert.equal(render(path).status, 200, path);
  for (const path of ['/unknown', '/service/unknown', '/project/unknown', '/news-event/unknown'])
    assert.equal(render(path).status, 404, path);
});
test('query filters render on the server and do not leak between requests', () => {
  const filtered = render('/projects?q=Kabeli');
  assert.match(filtered.html, /Kabeli-B HEP/);
  assert.doesNotMatch(render('/projects?q=nonexistentproject').html, /Kabeli-B HEP/);
  assert.match(render('/projects').html, /Kabeli-B HEP/);
});
test('admin routes render a safe browser-only boundary', () => {
  const page = render('/admin/team');
  assert.equal(page.status, 200);
  assert.match(page.html, /Loading secure workspace/);
  assert.doesNotMatch(page.html, /applicationKey|postgresql:\/\//);
});

test('service filters and project links preserve the original category relationships', () => {
  const { projects } = JSON.parse(
    readFileSync(new URL('../src/data/collections/projects.json', import.meta.url), 'utf8'),
  );
  const main = render('/projects?service=feasibility-studies').html.match(
    /<main[\s\S]*?<\/main>/,
  )[0];
  for (const project of projects) {
    assert.equal(
      main.includes('href="/project/' + project.slug + '"'),
      project.categories.includes('Feasibility Study'),
      project.slug,
    );
    assert.equal(render('/project/' + project.slug).status, 200, project.slug);
  }
  assert.match(
    render('/service/feasibility-studies').html,
    /href="\/projects\?service=feasibility-studies"/,
  );
  const projectMain = render('/project/kabeli-b-hep').html.match(/<main[\s\S]*?<\/main>/)[0];
  assert.match(projectMain, /href="\/service\/feasibility-studies"/);
});

test('map references are explicit and remain accessible before hydration', () => {
  const relationships = JSON.parse(
    readFileSync(new URL('../src/data/geography/project-map-links.json', import.meta.url), 'utf8'),
  );
  const { projects } = JSON.parse(
    readFileSync(new URL('../src/data/collections/projects.json', import.meta.url), 'utf8'),
  );
  const geography = JSON.parse(
    readFileSync(new URL('../src/data/mygeodata/all_projects.json', import.meta.url), 'utf8'),
  );
  for (const link of relationships.links) {
    assert.ok(
      projects.some((project) => project.slug === link.projectSlug),
      link.projectSlug,
    );
    assert.ok(
      geography.features.some(
        (feature) => Number(feature.properties.Name.split('.')[0]) === link.featureNumber,
      ),
      link.projectSlug,
    );
  }
  assert.match(render('/projects').html, /Interactive project map/);
  assert.match(render('/project/seti-khola-hydropower-project').html, /Projects on the map/);
  assert.match(render('/project/dobhan-285').html, /Geographic data has not been published/);
  assert.match(render('/contact').html, /Interactive office map/);
  const portfolio = render('/projects').html;
  assert.match(portfolio, /Upper Kabeli-2 HPP/);
  assert.match(portfolio, /Upper Marsyandi HPP/);
  assert.match(portfolio, /Location data not available/);
  assert.doesNotMatch(render('/project/kabeli-b-hep').html, /Upper Kabeli-2 HPP/);
  assert.match(render('/projects?q=Upper%20Kabeli-2').html, /Upper Kabeli-2 HPP/);
});
