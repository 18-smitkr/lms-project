// import { CheckCircle2, ShoppingBag, Award, ClipboardCheck, BookMarked } from 'lucide-react';

// const activities = [
//   {
//     Icon: CheckCircle2,
//     type: 'lesson',
//     title: 'Completed Lesson',
//     desc: 'Authentication with JWT',
//     course: 'Full Stack Bootcamp',
//     time: '2h ago',
//     color: '#22C55E',
//     bg: 'rgba(34,197,94,0.12)',
//   },
//   {
//     Icon: ShoppingBag,
//     type: 'purchase',
//     title: 'Enrolled in Course',
//     desc: 'Advanced React & Next.js',
//     course: 'by Sarah Chen',
//     time: '1d ago',
//     color: '#A855F7',
//     bg: 'rgba(147,51,234,0.12)',
//   },
//   {
//     Icon: Award,
//     type: 'cert',
//     title: 'Certificate Earned',
//     desc: 'JavaScript Essentials',
//     course: 'Completed with Distinction',
//     time: '3d ago',
//     color: '#F97316',
//     bg: 'rgba(249,115,22,0.12)',
//   },
//   {
//     Icon: ClipboardCheck,
//     type: 'quiz',
//     title: 'Quiz Completed',
//     desc: 'Node.js Fundamentals',
//     course: 'Score: 92 / 100',
//     time: '4d ago',
//     color: '#3B82F6',
//     bg: 'rgba(59,130,246,0.12)',
//   },
//   {
//     Icon: BookMarked,
//     type: 'lesson',
//     title: 'Completed Lesson',
//     desc: 'MongoDB Integration',
//     course: 'Full Stack Bootcamp',
//     time: '5d ago',
//     color: '#22C55E',
//     bg: 'rgba(34,197,94,0.12)',
//   },
// ];

// export default function RecentActivity() {
//   return (
//     <div className="glass-card rounded-3xl p-6 flex flex-col h-full">
//       <div className="flex items-center justify-between mb-5">
//         <div>
//           <h2 className="text-[16px] font-bold text-white/90">Recent Activity</h2>
//           <p className="text-[11px] text-white/30 mt-0.5">Your learning history</p>
//         </div>
//         <button className="text-[11.5px] text-purple-400/60 hover:text-purple-400 transition-colors font-medium">
//           View all
//         </button>
//       </div>

//       <div className="flex-1 space-y-1">
//         {activities.map(({ Icon, title, desc, course, time, color, bg }, i) => (
//           <div
//             key={i}
//             className="group flex gap-3.5 p-3 rounded-2xl transition-all duration-200 cursor-default"
//             style={{ borderRadius: '14px' }}
//               onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
//               onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
//           >
//             {/* Icon + timeline line */}
//             <div className="flex flex-col items-center">
//               <div
//                 className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200"
//                 style={{ background: bg, boxShadow: `0 0 12px ${color}20` }}
//               >
//                 <Icon size={15} style={{ color }} strokeWidth={2.2} />
//               </div>
//               {i < activities.length - 1 && (
//                 <div className="w-px flex-1 mt-2" style={{ background: 'rgba(255,255,255,0.05)', minHeight: '16px' }} />
//               )}
//             </div>

//             {/* Text */}
//             <div className="flex-1 min-w-0 pt-0.5">
//               <div className="flex items-start justify-between gap-1">
//                 <p className="text-[12.5px] font-semibold text-white/75 group-hover:text-white/90 transition-colors leading-tight">
//                   {title}
//                 </p>
//                 <span className="text-[10px] text-white/20 shrink-0 pt-0.5">{time}</span>
//               </div>
//               <p className="text-[12px] font-medium text-white/85 mt-0.5 leading-tight">{desc}</p>
//               <p className="text-[11px] text-white/30 mt-0.5">{course}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


export default function RecentActivity() {
  return (
    <section className="glass-ultra rounded-3xl p-6">

      <h2 className="text-xl font-bold text-white mb-6">
        Recent Activity
      </h2>

      <div className="space-y-4">

        <div className="rounded-2xl bg-white/5 h-20"></div>

        <div className="rounded-2xl bg-white/5 h-20"></div>

        <div className="rounded-2xl bg-white/5 h-20"></div>

        <div className="rounded-2xl bg-white/5 h-20"></div>

      </div>

    </section>
  );
}