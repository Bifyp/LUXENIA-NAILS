/** Four pointed nail silhouettes form the studio's print-style signature. */
export default function AtelierMark({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" focusable="false">
    {[0, 90, 180, 270].map(angle => <path key={angle} transform={`rotate(${angle} 50 50)`} d="M42 12a8 8 0 0 1 16 0v19L50 44l-8-13V12Z" />)}
  </svg>;
}
