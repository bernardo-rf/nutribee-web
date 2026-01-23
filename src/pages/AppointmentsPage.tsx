import React, { useState } from 'react';

import { CalendarIcon, ListBulletIcon, PlusIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

import AppointmentForm from '@/components/appointments/AppointmentForm';
import CalendarView from '@/components/appointments/CalendarView';
import PageLayout from '@/components/layout/PageLayout';

export interface Appointment {
  id: string;
  patientName: string;
  date: Date;
  time: string;
  duration: number; // in minutes
  type: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface ListViewProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ appointments, onEdit, onDelete }) => {
  return (
    <div className="min-h-[600px]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {appointment.patientName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(appointment.date, 'PPP')} at {appointment.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {appointment.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${appointment.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${appointment.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                    ${appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                  `}
                  >
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => onEdit(appointment)}
                    className="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(appointment.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AppointmentsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>();
  const [appointments] = useState<Appointment[]>([]); // TODO: This will be replaced with actual data fetching

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    // TODO: Implementation will go here
    console.log('Delete appointment:', appointmentId);
  };

  const handleEventClick = (appointment: Appointment) => {
    handleEditAppointment(appointment);
  };

  const handleFormSubmit = (_data: Omit<Appointment, 'id'>) => {
    setIsModalOpen(false);
    setSelectedAppointment(undefined);
  };

  const actions = (
    <>
      <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
        <button
          onClick={() => setViewMode('calendar')}
          className={`inline-flex items-center rounded-md px-3 py-2 text-sm ${
            viewMode === 'calendar'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          Calendar
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`inline-flex items-center rounded-md px-3 py-2 text-sm ${
            viewMode === 'list'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ListBulletIcon className="mr-2 h-4 w-4" />
          List
        </button>
      </div>

      <button
        onClick={() => {
          setSelectedAppointment(undefined);
          setIsModalOpen(true);
        }}
        className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        New Appointment
      </button>
    </>
  );

  const searchAndFilters = (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <input
        type="text"
        placeholder="Search appointments..."
        className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
      <select className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
        <option value="">All Status</option>
        <option value="scheduled">Scheduled</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <input
        type="date"
        value={format(selectedDate, 'yyyy-MM-dd')}
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
        className="rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
    </div>
  );

  return (
    <PageLayout
      title="Appointments"
      description="Manage your appointments and schedule"
      actions={actions}
      searchAndFilters={searchAndFilters}
    >
      {viewMode === 'calendar' ? (
        <CalendarView
          appointments={appointments}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onEventClick={handleEventClick}
        />
      ) : (
        <ListView
          appointments={appointments}
          onEdit={handleEditAppointment}
          onDelete={handleDeleteAppointment}
        />
      )}

      {/* Create/Edit Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50">
          <div className="absolute left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6">
            <h2 className="mb-4 text-lg font-medium">
              {selectedAppointment ? 'Edit Appointment' : 'Create New Appointment'}
            </h2>
            <AppointmentForm
              appointment={selectedAppointment}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setIsModalOpen(false);
                setSelectedAppointment(undefined);
              }}
            />
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default AppointmentsPage;
