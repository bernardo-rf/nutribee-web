import React, { useEffect } from 'react';

import {
  UsersIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

import { useClients } from '@/hooks/useClients';

const stats = [
  { name: 'Total Clients', value: '12', icon: UsersIcon },
  { name: 'Appointments This Week', value: '8', icon: CalendarIcon },
  { name: 'Active Programs', value: '5', icon: ChartBarIcon },
  { name: 'Client Progress', value: '92%', icon: ArrowTrendingUpIcon },
];

const Dashboard: React.FC = () => {
  const { getClients, status, error } = useClients();

  useEffect(() => {
    getClients();
  }, [getClients]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl">Error loading dashboard</div>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => getClients()}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Welcome to NutriBee</h1>
        <p className="mt-1 text-sm text-gray-500">Your nutrition practice management dashboard</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">{stat.name}</dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
            <div className="mt-6">
              <p className="text-center text-sm text-gray-500">No recent activity</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <h2 className="text-base font-semibold text-gray-900">Upcoming Appointments</h2>
            <div className="mt-6">
              <p className="text-center text-sm text-gray-500">No upcoming appointments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
