
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, List, PieChart, Settings, Plus } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/history', icon: List, label: 'History' },
  { path: '/add', icon: Plus, label: 'Add', isCentral: true },
  { path: '/reports', icon: PieChart, label: 'Reports' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-2xl border-t border-gray-200 dark:border-gray-700 max-w-lg mx-auto rounded-t-3xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.2)]">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => {
          const isActive = item.isCentral 
            ? location.pathname.startsWith(item.path) 
            : location.pathname === item.path;
            
          if (item.isCentral) {
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className="transform -translate-y-6 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full shadow-lg shadow-primary/50 text-white"
              >
                <item.icon size={32} />
              </NavLink>
            );
          }
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center transition-colors duration-200 ${isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <item.icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
