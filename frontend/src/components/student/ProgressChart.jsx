// import { TrendingUp, Target, Flame, Zap } from 'lucide-react';

// function Ring({ value, max, label, sublabel, color, trackColor, size, stroke }) {
//   const r = (size - stroke) / 2;
//   const circ = 2 * Math.PI * r;
//   const pct = Math.min(value / max, 1);
//   const offset = circ * (1 - pct);

//   return (
//     <div className="flex flex-col items-center gap-2">
//       <div className="relative" style={{ width: size, height: size }}>
//         <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
//           <circle cx={size / 2} cy={size / 2} r={r} fill="none"
//             stroke={trackColor} strokeWidth={stroke} />
//           <circle cx={size / 2} cy={size / 2} r={r} fill="none"
//             stroke={color} strokeWidth={stroke}
//             strokeLinecap="round"
//             strokeDasharray={`${circ} ${circ}`}
//             strokeDashoffset={offset}
//             style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
//           />
//         </svg>
//         <div className="absolute inset-0 flex flex-col items-center justify-center">
//           <span className="text-[18px] font-black text-white leading-none">{label}</span>
//           <span className="text-[9px] text-white/30 mt-0.5">{sublabel}</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// const barData = [
//   { d: 'M', h: 2.5, active: false },
//   { d: 'T', h: 1.5, active: false },
//   { d: 'W', h: 3.8, active: false },
//   { d: 'T', h: 0.8, active: false },
//   { d: 'F', h: 2.2, active: false },
//   { d: 'S', h: 4.0, active: true },
//   { d: 'S', h: 0.0, active: false },
// ];
// const maxH = Math.max(...barData.map(d => d.h));

// export default function LearningProgress() {
//   return (
//     <div className="glass-card rounded-3xl p-6 flex flex-col h-full">
//       <div className="flex items-center justify-between mb-5">
//         <div>
//           <h2 className="text-[16px] font-bold text-white/90">Learning Progress</h2>
//           <p className="text-[11px] text-white/30 mt-0.5">Performance overview</p>
//         </div>
//         <div
//           className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer text-[11px] text-white/40 font-medium"
//           style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
//         >
//           This week
//           <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
//             <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//           </svg>
//         </div>
//       </div>

//       {/* Bar chart */}
//       <div className="mb-5">
//         <div className="flex items-end gap-1.5 h-20">
//           {barData.map(({ d, h, active }, i) => (
//             <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
//               <div className="w-full flex items-end justify-center" style={{ height: 64 }}>
//                 <div
//                   className="w-full rounded-t-xl transition-all duration-300"
//                   style={{
//                     height: h > 0 ? `${(h / maxH) * 64}px` : '4px',
//                     background: active
//                       ? 'linear-gradient(180deg, #A855F7 0%, #9333EA 100%)'
//                       : 'rgba(255,255,255,0.07)',
//                     boxShadow: active ? '0 -4px 12px rgba(147,51,234,0.4)' : 'none',
//                     opacity: h === 0 ? 0.3 : 1,
//                   }}
//                 />
//               </div>
//               <span className={`text-[10px] font-medium ${active ? 'text-purple-400' : 'text-white/25'}`}>{d}</span>
//             </div>
//           ))}
//         </div>
//         <div className="flex justify-between mt-1">
//           <span className="text-[10.5px] text-white/25">Daily hours</span>
//           <span className="text-[10.5px] font-semibold text-white/50">14.5h total</span>
//         </div>
//       </div>

//       <div className="divider mb-5" />

//       {/* Rings */}
//       <div className="flex justify-around mb-5">
//         <div className="text-center">
//           <Ring value={72} max={100} label="72%" sublabel="weekly" color="#9333EA" trackColor="rgba(147,51,234,0.12)" size={84} stroke={7} />
//           <p className="text-[10.5px] text-white/35 mt-1.5">Weekly Goal</p>
//         </div>
//         <div className="text-center">
//           <Ring value={88} max={100} label="88%" sublabel="monthly" color="#F97316" trackColor="rgba(249,115,22,0.12)" size={84} stroke={7} />
//           <p className="text-[10.5px] text-white/35 mt-1.5">Monthly</p>
//         </div>
//         <div className="text-center">
//           <Ring value={14} max={30} label="14d" sublabel="streak" color="#22C55E" trackColor="rgba(34,197,94,0.12)" size={84} stroke={7} />
//           <p className="text-[10.5px] text-white/35 mt-1.5">Streak</p>
//         </div>
//       </div>

//       <div className="divider mb-4" />

//       {/* Bottom stats */}
//       <div className="grid grid-cols-3 gap-2 mt-auto">
//         {[
//           { icon: TrendingUp, val: '2.1h', lbl: 'Daily avg', color: 'text-purple-400' },
//           { icon: Target, val: '5/7', lbl: 'Goal met', color: 'text-orange-400' },
//           { icon: Flame, val: 'Sat', lbl: 'Best day', color: 'text-yellow-400' },
//         ].map(({ icon: Icon, val, lbl, color }) => (
//           <div key={lbl} className="text-center px-2 py-3 rounded-2xl"
//             style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
//             <Icon size={13} className={`${color} mx-auto mb-1.5`} />
//             <p className="text-[14px] font-bold text-white leading-none mb-1">{val}</p>
//             <p className="text-[10px] text-white/25">{lbl}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

export default function ProgressCircle() {
  return (
    <div className="w-32 h-32 rounded-full border-10 border-purple-600 flex items-center justify-center">

      <span className="text-2xl font-bold text-white">
        75%
      </span>

    </div>
  );
}
