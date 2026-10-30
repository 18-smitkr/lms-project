// import { Flame, BookOpen, Clock, Award, GraduationCap, TrendingUp, ArrowUpRight } from 'lucide-react';

// const stats = [
//   {
//     icon: BookOpen,
//     label: 'Enrolled',
//     value: '12',
//     sub: 'Courses',
//     delta: '+2',
//     deltaLabel: 'this month',
//     color: 'purple',
//     iconClass: 'text-purple-400',
//     iconBg: 'icon-bg-purple',
//     gradient: 'from-purple-500/20 to-transparent',
//   },
//   {
//     icon: GraduationCap,
//     label: 'Completed',
//     value: '8',
//     sub: 'Courses',
//     delta: '+1',
//     deltaLabel: 'this week',
//     color: 'orange',
//     iconClass: 'text-orange-400',
//     iconBg: 'icon-bg-orange',
//     gradient: 'from-orange-500/20 to-transparent',
//   },
//   {
//     icon: Clock,
//     label: 'Hours',
//     value: '142',
//     sub: 'Learned',
//     delta: '+18h',
//     deltaLabel: 'this week',
//     color: 'blue',
//     iconClass: 'text-blue-400',
//     iconBg: 'icon-bg-blue',
//     gradient: 'from-blue-500/20 to-transparent',
//   },
//   {
//     icon: Award,
//     label: 'Certificates',
//     value: '5',
//     sub: 'Earned',
//     delta: '+1',
//     deltaLabel: 'this month',
//     color: 'green',
//     iconClass: 'text-accent-green',
//     iconBg: 'icon-bg-green',
//     gradient: 'from-green-500/20 to-transparent',
//   },
// ];

// const weekDots = [
//   { day: 'M', active: true }, { day: 'T', active: true }, { day: 'W', active: false },
//   { day: 'T', active: true }, { day: 'F', active: true }, { day: 'S', active: true },
//   { day: 'S', active: false },
// ];

// export default function HeroStats() {
//   return (
//     <div className="space-y-5">
//       {/* ── Hero Banner ── */}
//       <div
//         className="relative rounded-3xl overflow-hidden p-8 border-gradient-shine"
//         style={{
//           background: 'linear-gradient(135deg, rgba(19,19,32,0.95) 0%, rgba(26,19,40,0.95) 50%, rgba(19,19,32,0.95) 100%)',
//           boxShadow: '0 1px 1px rgba(0,0,0,0.5), 0 8px 32px rgba(0,0,0,0.4)',
//         }}
//       >
//         {/* Ambient background */}
//         <div className="absolute inset-0 pointer-events-none">
//           <div
//             className="absolute -top-32 -right-20 w-125 h-125 rounded-full animate-float-slow"
//             style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.18) 0%, transparent 60%)' }}
//           />
//           <div
//             className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full animate-float-medium"
//             style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 60%)' }}
//           />
//           {/* Grid pattern */}
//           <div className="absolute inset-0" style={{
//             backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
//             backgroundSize: '28px 28px',
//           }} />
//         </div>

//         <div className="relative flex items-start justify-between gap-8 flex-wrap">
//           {/* Left */}
//           <div className="flex-1 min-w-65">
//             <div
//               className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-[11px] font-semibold text-purple-300"
//               style={{ background: 'rgba(147,51,234,0.12)', border: '1px solid rgba(147,51,234,0.25)' }}
//             >
//               <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-glow-pulse" />
//               Active Learning Session
//             </div>

//             <h1 className="text-[38px] font-black tracking-tight leading-[1.1] mb-3">
//               <span className="text-white">Welcome back,</span>
//               <br />
//               <span className="text-gradient-purple">Sumit! 👋</span>
//             </h1>
//             <p className="text-[14.5px] text-white/45 max-w-sm leading-relaxed mb-6">
//               You're on a roll — 80% through your top course. Keep the momentum going today.
//             </p>

//             <div className="flex items-center gap-3 flex-wrap">
//               <button className="btn-orange flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-white">
//                 <span>Continue Learning</span>
//                 <ArrowUpRight size={14} />
//               </button>
//               <button className="btn-ghost flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-white/60">
//                 View Schedule
//               </button>
//             </div>
//           </div>

//           {/* Right – Streak + Weekly heatmap */}
//           <div className="flex flex-col gap-4">
//             {/* Streak card */}
//             <div
//               className="relative px-5 py-4 rounded-3xl overflow-hidden"
//               style={{
//                 background: 'rgba(249,115,22,0.09)',
//                 border: '1px solid rgba(249,115,22,0.22)',
//                 boxShadow: '0 0 30px rgba(249,115,22,0.1)',
//               }}
//             >
//               <div className="flex items-center gap-4">
//                 <div
//                   className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
//                   style={{ background: 'rgba(249,115,22,0.15)', boxShadow: '0 0 24px rgba(249,115,22,0.35)' }}
//                 >
//                   <Flame size={28} className="text-orange-400" />
//                 </div>
//                 <div>
//                   <div className="flex items-end gap-1.5">
//                     <span className="text-[32px] font-black text-white leading-none">14</span>
//                     <span className="text-orange-400 font-bold text-sm pb-1">days</span>
//                   </div>
//                   <p className="text-[12px] text-white/45 font-medium">Daily Streak</p>
//                 </div>
//               </div>

//               {/* Week dots */}
//               <div className="flex gap-1.5 mt-3.5">
//                 {weekDots.map(({ day, active }, i) => (
//                   <div key={i} className="flex flex-col items-center gap-1">
//                     <div
//                       className="w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all"
//                       style={{
//                         background: active ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.05)',
//                         boxShadow: active ? '0 0 8px rgba(249,115,22,0.4)' : 'none',
//                         color: active ? '#FB923C' : 'rgba(255,255,255,0.2)',
//                         border: `1px solid ${active ? 'rgba(249,115,22,0.4)' : 'transparent'}`,
//                       }}
//                     >
//                       {day}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Quick stat pill */}
//             <div
//               className="flex items-center justify-between px-4 py-3 rounded-2xl"
//               style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
//             >
//               <div className="flex items-center gap-2.5">
//                 <TrendingUp size={14} className="text-green-400" />
//                 <span className="text-[12.5px] text-white/60 font-medium">This week</span>
//               </div>
//               <div className="flex items-center gap-1.5">
//                 <span className="text-[13.5px] font-bold text-white">14.5h</span>
//                 <span className="text-[11px] text-green-400 font-semibold">+23%</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Stats Row ── */}
//       <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
//         {stats.map(({ icon: Icon, label, value, sub, delta, deltaLabel, iconClass, iconBg }) => (
//           <div
//             key={label}
//             className="card-hover glass-card rounded-3xl p-5 relative overflow-hidden group"
//           >
//             {/* Corner glow */}
//             <div className="absolute bottom-0 right-0 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
//               style={{ background: 'radial-gradient(circle, rgba(147,51,234,0.12), transparent)', transform: 'translate(30%,30%)' }} />

//             <div className="relative">
//               <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${iconBg}`}>
//                 <Icon size={18} className={iconClass} strokeWidth={2} />
//               </div>

//               <div className="flex items-end gap-2 mb-1">
//                 <span className="text-[36px] font-black stat-number leading-none tracking-tight">{value}</span>
//                 <span className="text-[13px] text-white/35 font-medium pb-1.5">{sub}</span>
//               </div>
//               <p className="text-[12.5px] text-white/40 font-medium mb-3">{label}</p>

//               <div className="flex items-center gap-1.5">
//                 <span
//                   className="text-[10px] font-bold px-1.5 py-0.5 rounded-lg"
//                   style={{ background: 'rgba(34,197,94,0.12)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.2)' }}
//                 >
//                   {delta}
//                 </span>
//                 <span className="text-[11px] text-white/25">{deltaLabel}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


export default function ProfileDropdown() {
  return (
    <div className="flex items-center gap-3">

      <img
        src="https://i.pravatar.cc/100"
        alt="profile"
        className="w-12 h-12 rounded-full"
      />

      <div>

        <h3 className="font-semibold text-white">
          Student
        </h3>

        <p className="text-white/40 text-sm">
          View Profile
        </p>

      </div>

    </div>
  );
}