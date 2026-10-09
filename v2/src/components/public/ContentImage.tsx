import { useState, type ImgHTMLAttributes } from 'react';
import { publicContent } from '../../services/publicContent';
import styles from './ContentImage.module.css';

export default function ContentImage({
  src,
  alt = '',
  className = '',
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [failedSource, setFailedSource] = useState<string>();
  const fallback = !src?.trim() || failedSource === src;
  return (
    <img
      {...props}
      src={fallback ? publicContent.company.assets.logoUrl : src}
      alt={fallback && alt ? 'CEC Nepal logo' : alt}
      className={className + (fallback ? ' ' + styles.fallback : '')}
      onError={fallback ? undefined : () => setFailedSource(src)}
    />
  );
}
