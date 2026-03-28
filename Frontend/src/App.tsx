import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from '@/components/ui/toast'
import { AppLayout } from '@/components/layout/AppLayout'
import { ClientLayout } from '@/components/layout/ClientLayout'
import LoginPage from '@/pages/Login'
import DashboardPage from '@/pages/Dashboard'
import PropertiesPage from '@/pages/Properties'
import RoomsPage from '@/pages/Rooms'
import TenantsPage from '@/pages/Tenants'
import ContractsPage from '@/pages/Contracts'
import InvoicesPage from '@/pages/Invoices'
import ReportsPage from '@/pages/Reports'
import AIAssistantPage from '@/pages/AIAssistant'
import SettingsPage from '@/pages/Settings'
import ClientHomePage from '@/pages/Client/Home'
import ClientRoomListPage from '@/pages/Client/Rooms'
import ClientRoomDetailPage from '@/pages/Client/Rooms/Detail'
import ClientContactPage from '@/pages/Client/Contact'
import ClientAuthPage from '@/pages/Client/Auth'
import ClientFeaturesPage from '@/pages/Client/Features'
import ClientAboutPage from '@/pages/Client/About'
import ClientProfilePage from '@/pages/Client/Profile'
import ClientMyBookingsPage from '@/pages/Client/MyBookings'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public — Customer facing */}
            <Route element={<ClientLayout />}>
              <Route path="/client" element={<ClientHomePage />} />
              <Route path="/client/rooms" element={<ClientRoomListPage />} />
              <Route path="/client/rooms/:id" element={<ClientRoomDetailPage />} />
              <Route path="/client/contact" element={<ClientContactPage />} />
              <Route path="/client/features" element={<ClientFeaturesPage />} />
              <Route path="/client/about" element={<ClientAboutPage />} />
              <Route path="/client/profile" element={<ClientProfilePage />} />
              <Route path="/client/my-bookings" element={<ClientMyBookingsPage />} />
            </Route>

            {/* Client Auth (no layout — fullscreen) */}
            <Route path="/client/auth" element={<ClientAuthPage />} />

            {/* Admin */}
            <Route path="/login" element={<LoginPage />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/tenants" element={<TenantsPage />} />
              <Route path="/contracts" element={<ContractsPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/ai-assistant" element={<AIAssistantPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  )
}
