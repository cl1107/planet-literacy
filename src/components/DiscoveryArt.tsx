import { useId } from 'react';

// 几何图形表现想象星球，每颗星拥有稳定的配色、地貌和卫星位置。
export function DiscoveryArt({ appearance }: { appearance: number }) {
  const clipId = useId();
  const hue = (appearance * 137.508 + 155) % 360;
  const color = `hsl(${hue} 38% 62%)`;
  const light = `hsl(${hue} 42% 77%)`;
  const dark = `hsl(${hue} 32% 42%)`;
  const terrain = appearance % 6;
  return <svg className="planet-art" viewBox="0 0 200 160" fill="none" aria-hidden="true">
    {terrain === 5 && <ellipse cx="100" cy="80" rx="87" ry="24" transform={`rotate(${-35 + appearance % 25} 100 80)`} stroke={light} strokeWidth="9" />}
    <svg x="45" y="25" width="110" height="110" viewBox="0 0 110 110">
      <clipPath id={clipId}><circle cx="55" cy="55" r="53" /></clipPath>
      <g clipPath={`url(#${clipId})`}>
        <circle cx="55" cy="55" r="53" fill={color} />
        {terrain === 0 && [20, 45, 72].map((y) => <path key={y} d={`M-5 ${y} Q25 ${y - 20} 55 ${y} T115 ${y}`} stroke={light} strokeWidth="12" />)}
        {terrain === 1 && [0, 1, 2, 3, 4].map((i) => <circle key={i} cx={18 + (i * 31 + appearance) % 80} cy={18 + (i * 19) % 75} r={7 + i * 2} fill={dark} />)}
        {terrain === 2 && <><path d="M-5 60L22 24L43 57L70 12L115 66V115H-5Z" fill={dark} /><path d="M-5 87L34 63L61 84L90 54L115 85V115H-5Z" fill={light} /></>}
        {terrain === 3 && [0, 1, 2, 3].map((i) => <path key={i} d={`M${i * 32 - 20} -5Q${i * 32 + 35} 45 ${i * 32} 115`} stroke={light} strokeWidth="17" />)}
        {terrain === 4 && <><path d="M0 16L29 6L47 33L27 47L36 69L9 80L0 52Z" fill={dark} /><path d={`M65 ${24 + appearance % 12}L107 40L95 65L105 93L67 105L54 80L72 60Z`} fill={light} /></>}
        {terrain === 5 && [25, 47, 70, 92].map((y) => <path key={y} d={`M0 ${y}H110`} stroke={dark} strokeWidth="7" />)}
      </g>
    </svg>
    <circle cx={165 + appearance % 10} cy={20 + appearance % 25} r={5 + appearance % 6} fill={light} />
    {terrain === 5 && <path d="M22 112C53 128 137 103 177 57" stroke={light} strokeWidth="7" strokeLinecap="round" />}
  </svg>;
}
