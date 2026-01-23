import React, { useState, useEffect } from 'react';

import { MagnifyingGlassIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';

import AddClientModal from '@/components/clients/AddClientModal';
import PageLayout from '@/components/layout/PageLayout';
import { useClients } from '@/hooks/useClients';
import type { AppDispatch } from '@/store';
import { clearError } from '@/store/slices/clientsSlice';
import type { Client } from '@/types/domain';

const ClientsList: React.FC<{ clients: Client[]; isLoading: boolean }> = ({
  clients,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
        <p className="mt-2 text-sm text-gray-500">Loading clients...</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500">No clients found</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {clients.map((client) => (
        <li key={client.id}>
          <div className="px-6 py-4 flex items-center">
            <div className="min-w-0 flex-1">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-medium text-sm">
                    {client.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{client.name}</p>
                  <p className="text-sm text-gray-500">{client.email}</p>
                </div>
              </div>
            </div>
            <div className="ml-6 flex items-center space-x-4">
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                View Details
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

const ClientsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { clients, isLoading, error, getClients } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    getClients();
  }, [getClients]);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddSuccess = () => {
    getClients();
  };

  const handleDismissError = () => {
    dispatch(clearError());
  };

  const actions = (
    <button
      type="button"
      onClick={() => setIsAddModalOpen(true)}
      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    >
      <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
      Add Client
    </button>
  );

  const searchAndFilters = (
    <div className="flex max-w-md">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          placeholder="Search clients..."
        />
      </div>
    </div>
  );

  return (
    <PageLayout
      title="Clients"
      description="Manage your client list and their information"
      actions={actions}
      searchAndFilters={searchAndFilters}
    >
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XMarkIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={handleDismissError}
                  className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                >
                  <span className="sr-only">Dismiss</span>
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ClientsList clients={filteredClients} isLoading={isLoading} />
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </PageLayout>
  );
};

export default ClientsPage;
