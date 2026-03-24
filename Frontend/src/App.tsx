import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppLayout } from '@/components/layout/AppLayout'
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
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
    </QueryClientProvider>
  )
}
