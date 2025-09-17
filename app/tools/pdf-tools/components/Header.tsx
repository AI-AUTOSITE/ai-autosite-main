'use client';

import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Mobile menu button */}
            <button 
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">PDF Tools</h1>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Pick 3. Use forever. Free.
              </p>
            </div>
          </div>
          
          {/* Premium button */}
          <button className="animate-pulse-subtle px-3 py-2 md:px-4 md:py-2 text-xs md:text-sm font-medium bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition shadow-md">
            🎁 Get More Tool Slots
          </button>
        </div>
      </div>
    </header>
  );
}