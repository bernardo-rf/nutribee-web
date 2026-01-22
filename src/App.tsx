import React from 'react'

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import ErrorBoundary from './components/common/ErrorBoundary'
import DashboardLayout from './components/layouts/DashboardLayout'
import AppointmentsPage from './pages/AppointmentsPage'
import ClientsPage from './pages/Clients'
import Dashboard from './pages/Dashboard'

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="reports" element={<div>Reports Page (Coming Soon)</div>} />
            <Route path="profile" element={<div>Profile Page (Coming Soon)</div>} />
            <Route path="settings" element={<div>Settings Page (Coming Soon)</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App 