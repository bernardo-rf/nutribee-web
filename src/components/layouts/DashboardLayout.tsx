import React, { useState } from 'react';

import {
  HomeIcon,
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { Link, Outlet, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Clients', href: '/clients', icon: UsersIcon },
  { name: 'Appointments', href: '/appointments', icon: CalendarIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 overflow-hidden transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Toggle */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <span className="text-2xl font-bold text-emerald-600">NutriBee</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md group ${
                    isActive ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Collapsed Icons Bar */}
      <div
        className={`fixed inset-y-0 left-0 w-20 bg-white border-r border-gray-200 transition-opacity duration-300 ease-in-out ${
          isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Toggle Button */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Icons Only Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-center py-2 text-sm font-medium rounded-md group ${
                    isActive ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={item.name}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'pl-64' : 'pl-20'}`}
      >
        <main className="py-6 px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
