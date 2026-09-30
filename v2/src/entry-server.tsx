import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { getPageMetadata } from './routing/metadata';
export function render(url: string) {
  return { ...getPageMetadata(url), html: renderToString(<StaticRouter location={url}><App /></StaticRouter>) };
}
