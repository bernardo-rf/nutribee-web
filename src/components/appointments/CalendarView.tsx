import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { format } from 'date-fns';

import type { Appointment } from '../../pages/AppointmentsPage';
import './../../styles/CalendarView.css';

interface CalendarViewProps {
  appointments: Appointment[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onEventClick: (appointment: Appointment) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  selectedDate,
  onDateSelect,
  onEventClick,
}) => {
  const events = appointments.map((appointment) => ({
    id: appointment.id,
    title: `${appointment.patientName} - ${appointment.type}`,
    start: `${format(appointment.date, 'yyyy-MM-dd')}T${appointment.time}`,
    end: `${format(appointment.date, 'yyyy-MM-dd')}T${addMinutesToTime(appointment.time, appointment.duration)}`,
    backgroundColor: getStatusColor(appointment.status),
    borderColor: getStatusColor(appointment.status),
    extendedProps: appointment,
    classNames: ['appointment-event', `status-${appointment.status}`],
  }));

  return (
    <div className="calendar-container h-[calc(100vh-100px)]">
      <div className="h-[600px]">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialDate={selectedDate}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          eventClick={(info) => {
            onEventClick(info.event.extendedProps as Appointment);
          }}
          select={(info) => {
            onDateSelect(info.start);
          }}
          slotMinTime="09:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          height="600px"
          stickyHeaderDates={true}
          nowIndicator={true}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
          }}
          slotDuration="00:15:00"
          slotLabelInterval="01:00"
          expandRows={true}
          handleWindowResize={true}
          dayHeaderFormat={{ weekday: 'short' }}
          titleFormat={{ year: 'numeric', month: 'long' }}
          multiMonthMaxColumns={3}
          multiMonthMinWidth={300}
          eventDisplay="block"
          eventMinHeight={25}
          eventShortHeight={25}
          eventMaxStack={3}
          eventDidMount={(info) => {
            // Add tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'fc-tooltip';
            tooltip.innerHTML = `
              <div class="fc-tooltip-title">${info.event.title}</div>
              <div class="fc-tooltip-time">${format(new Date(info.event.start!), 'h:mm a')} - ${format(new Date(info.event.end!), 'h:mm a')}</div>
            `;
            info.el.appendChild(tooltip);
          }}
        />
      </div>
    </div>
  );
};

// Helper function to add minutes to a time string
const addMinutesToTime = (time: string, minutes: number): string => {
  const date = new Date();
  const [hours, mins] = time.split(':');
  date.setHours(Number.parseInt(hours || '0', 10), Number.parseInt(mins || '0', 10));
  date.setMinutes(date.getMinutes() + minutes);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// Helper function to get color based on appointment status
const getStatusColor = (status: Appointment['status']): string => {
  switch (status) {
    case 'scheduled':
      return '#3B82F6'; // blue-500
    case 'completed':
      return '#10B981'; // green-500
    case 'cancelled':
      return '#EF4444'; // red-500
    default:
      return '#6B7280'; // gray-500
  }
};

export default CalendarView;
