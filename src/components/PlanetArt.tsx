import type { PlanetKind } from '../content/themes';

// 主题图形是几何标识，不用于天体比例、真实外观或看图识字题目。
export function PlanetArt({ kind, className = '' }: { kind: PlanetKind; className?: string }) {
  return (
    <svg className={`planet-art ${className}`} viewBox="0 0 200 160" fill="none" aria-hidden="true">
      {kind === 'sun' && <>
        {Array.from({ length: 12 }, (_, index) => <path key={index} d="M100 15V27" stroke="#d09229" strokeWidth="5" strokeLinecap="round" transform={`rotate(${index * 30} 100 80)`} />)}
        <circle cx="100" cy="80" r="43" fill="#edb654" />
        <circle cx="88" cy="67" r="25" fill="#f5c874" />
      </>}
      {kind === 'moon' && <>
        <circle cx="100" cy="80" r="53" fill="#b6adca" />
        <circle cx="86" cy="61" r="14" fill="#928aa6" /><circle cx="119" cy="96" r="19" fill="#a299b7" /><circle cx="78" cy="101" r="7" fill="#928aa6" />
      </>}
      {kind === 'earth' && <>
        <circle cx="100" cy="80" r="53" fill="#79a4b1" />
        <path d="M62 45L87 31L97 46L82 57L90 71L71 81L60 71L47 74A53 53 0 0 1 62 45Z" fill="#648d66" />
        <path d="M119 49L139 58L152 80L142 99L123 97L119 113L104 103L107 82L98 71Z" fill="#7a9e69" />
        <path d="M75 109L93 117L88 131L76 127Z" fill="#648d66" />
      </>}
      {kind === 'mars' && <>
        <circle cx="100" cy="80" r="48" fill="#ce8867" />
        <path d="M56 66L89 73L130 48M64 108L102 93L141 101" stroke="#b46e52" strokeWidth="10" strokeLinecap="round" />
        <circle cx="116" cy="70" r="9" fill="#bd795a" />
      </>}
      {kind === 'saturn' && <>
        <ellipse cx="100" cy="80" rx="84" ry="22" transform="rotate(-23 100 80)" stroke="#c1a16b" strokeWidth="13" />
        <circle cx="100" cy="80" r="42" fill="#d2b278" />
        <path d="M66 62H134M59 82H141M68 102H133" stroke="#bf9e62" strokeWidth="6" />
        <path d="M22 112C53 128 137 103 177 57" stroke="#e3cc9d" strokeWidth="10" strokeLinecap="round" />
      </>}
      {kind === 'galaxy' && <>
        <ellipse cx="100" cy="80" rx="71" ry="31" transform="rotate(-25 100 80)" stroke="#a29abc" strokeWidth="11" />
        <ellipse cx="100" cy="80" rx="48" ry="20" transform="rotate(-25 100 80)" stroke="#c7bfd5" strokeWidth="10" />
        <circle cx="100" cy="80" r="14" fill="#e1bb69" /><path d="M45 35V49M38 42H52M156 109V123M149 116H163" stroke="#8c81a6" strokeWidth="3" strokeLinecap="round" />
      </>}
    </svg>
  );
}
