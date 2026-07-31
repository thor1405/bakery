import { Search, Bell, Menu, CircleUserRound } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      
      {/* Left side: Breadcrumbs / Page Title */}
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 hidden sm:block">
          Overview
        </h1>
      </div>

      {/* Center: Command Palette / Search */}
      <div className="flex-1 max-w-xl mx-8 hidden md:block">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg leading-5 bg-gray-50 dark:bg-[#242424] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-[#1a1a1a] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] sm:text-sm transition-all"
            placeholder="Search orders, customers, products... (⌘K)"
          />
        </div>
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center space-x-4 sm:space-x-6">
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#1a1a1a]"></span>
        </button>
        
        <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-gray-700 pl-4 sm:pl-6 cursor-pointer">
          <CircleUserRound className="h-8 w-8 text-gray-400" />
          <div className="hidden sm:block text-sm text-right">
            <p className="font-medium text-gray-700 dark:text-gray-200 leading-none">Admin User</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
