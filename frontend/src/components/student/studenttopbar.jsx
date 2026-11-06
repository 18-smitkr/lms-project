// import { Search, Bell, SlidersHorizontal, ChevronDown, Command } from 'lucide-react';

// export default function TopNav() {
//   return (
//     <header
//       className="sticky top-0 z-30 h-17 flex items-center px-8 gap-4"
//       style={{
//         background: 'rgba(8,8,14,0.85)',
//         backdropFilter: 'blur(24px)',
//         borderBottom: '1px solid rgba(255,255,255,0.055)',
//         boxShadow: '0 1px 0 rgba(255,255,255,0.04)',
//       }}
//     >
//       {/* Page title */}
//       <div className="mr-4">
//         <h1 className="text-[15px] font-semibold text-white/90 leading-tight">Dashboard</h1>
//         <p className="text-[11px] text-white/30">Sunday, July 13, 2025</p>
//       </div>

//       {/* Search */}
//       <div className="flex-1 max-w-sm relative">
//         <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
//         <input
//           type="text"
//           placeholder="Search anything..."
//           className="w-full h-9 pl-9 pr-14 rounded-2xl text-[13px] text-white/70 placeholder:text-white/20 outline-none transition-all duration-200 focus:border-purple-500/40"
//           style={{
//             background: 'rgba(255,255,255,0.05)',
//             border: '1px solid rgba(255,255,255,0.08)',
//           }}
//           onFocus={e => {
//             e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
//             e.currentTarget.style.borderColor = 'rgba(147,51,234,0.4)';
//           }}
//           onBlur={e => {
//             e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
//             e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
//           }}
//         />
//         <div
//           className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg"
//           style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
//         >
//           <Command size={9} className="text-white/30" />
//           <span className="text-[9px] text-white/30 font-medium">K</span>
//         </div>
//       </div>

//       {/* Spacer */}
//       <div className="flex-1" />

//       {/* Right controls */}
//       <div className="flex items-center gap-2.5">
//         {/* Filter */}
//         <button
//           className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer"
//           style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
//           onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
//           onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
//         >
//           <SlidersHorizontal size={14} className="text-white/50" />
//         </button>

//         {/* Notifications */}
//         <button
//           className="relative w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer"
//           style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
//           onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)'; }}
//           onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
//         >
//           <Bell size={14} className="text-white/50" />
//           <span
//             className="dot-live absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
//             style={{ background: '#F97316', boxShadow: '0 0 6px rgba(249,115,22,0.8)' }}
//           />
//         </button>

//         {/* Divider */}
//         <div className="w-px h-6 bg-white/8" />

//         {/* Avatar */}
//         <button className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-2xl transition-all duration-200 cursor-pointer group"
//           style={{ border: '1px solid rgba(255,255,255,0.07)' }}
//           onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
//           onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
//         >
//           <div className="relative">
//             <img
//               src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop"
//               alt="Sumit"
//               className="w-7 h-7 rounded-full object-cover"
//               style={{ boxShadow: '0 0 0 1.5px rgba(147,51,234,0.5)' }}
//             />
//             <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border"
//               style={{ background: '#22C55E', borderColor: '#08080E' }} />
//           </div>
//           <div className="hidden md:block text-left">
//             <p className="text-[12.5px] font-semibold text-white/85 leading-tight">Sumit Kumar</p>
//             <p className="text-[10px] text-white/30">Pro Student</p>
//           </div>
//           <ChevronDown size={12} className="text-white/25 hidden md:block" />
//         </button>
//       </div>
//     </header>
//   );
// }
import ProfileDropdown from "./ProfileDropdown";
import { Menu } from "lucide-react";

export default function Topbar({ onMenuClick, isMenuOpen, title = "Dashboard" }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#E5E9EF] bg-white/95 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open student navigation"
            aria-controls="student-sidebar"
            aria-expanded={isMenuOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E7E7E7] bg-white text-[#7D7D7D] transition hover:border-[#FE580D] hover:text-[#C44808] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FE580D] md:hidden"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold text-[#171717] sm:text-3xl">
              {title}
            </h1>
            <p className="mt-1 hidden text-sm text-[#737373] sm:block">
              Welcome back
            </p>
          </div>
        </div>
        <ProfileDropdown />
      </div>
    </header>
  );
}