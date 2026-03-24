const API_BASE = 'http://127.0.0.1:8000/api/v1'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Lỗi kết nối server' }))
    throw new Error(error.message || `HTTP ${res.status}`)
  }

  return res.json()
}

export const api = {
  // Dashboard
  getDashboard: () => request<any>('/dashboard'),

  // Properties
  getProperties: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<any[]>(`/properties${qs}`)
  },
  createProperty: (data: any) => request<any>('/properties', { method: 'POST', body: JSON.stringify(data) }),
  updateProperty: (id: number, data: any) => request<any>(`/properties/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProperty: (id: number) => request<any>(`/properties/${id}`, { method: 'DELETE' }),

  // Rooms
  getRooms: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<any[]>(`/rooms${qs}`)
  },
  createRoom: (data: any) => request<any>('/rooms', { method: 'POST', body: JSON.stringify(data) }),
  updateRoom: (id: number, data: any) => request<any>(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRoom: (id: number) => request<any>(`/rooms/${id}`, { method: 'DELETE' }),

  // Tenants
  getTenants: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<any[]>(`/tenants${qs}`)
  },
  createTenant: (data: any) => request<any>('/tenants', { method: 'POST', body: JSON.stringify(data) }),
  updateTenant: (id: number, data: any) => request<any>(`/tenants/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTenant: (id: number) => request<any>(`/tenants/${id}`, { method: 'DELETE' }),

  // Contracts
  getContracts: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<any[]>(`/contracts${qs}`)
  },
  createContract: (data: any) => request<any>('/contracts', { method: 'POST', body: JSON.stringify(data) }),
  updateContract: (id: number, data: any) => request<any>(`/contracts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteContract: (id: number) => request<any>(`/contracts/${id}`, { method: 'DELETE' }),

  // Invoices
  getInvoices: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request<any[]>(`/invoices${qs}`)
  },
  createInvoice: (data: any) => request<any>('/invoices', { method: 'POST', body: JSON.stringify(data) }),
  updateInvoice: (id: number, data: any) => request<any>(`/invoices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteInvoice: (id: number) => request<any>(`/invoices/${id}`, { method: 'DELETE' }),

  // Auth
  login: (data: { email: string; password: string }) =>
    fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (!res.ok) throw new Error((await res.json()).message)
      return res.json()
    }),
}
