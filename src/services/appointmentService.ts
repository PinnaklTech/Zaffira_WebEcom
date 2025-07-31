import api from './api';

export interface AppointmentRequest {
  userId?: string;
  guestId?: string;
  appointment_date: string;
  notes?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
}

export const appointmentService = {
  createAppointment: async (data: AppointmentRequest) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  getAppointment: async (id: string) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  // Admin only
  getAllAppointments: async () => {
    const response = await api.get('/admin/appointments');
    return response.data;
  },

  updateAppointmentStatus: async (id: string, status: string) => {
    const response = await api.put(`/admin/appointments/${id}`, { status });
    return response.data;
  },

  deleteAppointment: async (id: string) => {
    const response = await api.delete(`/admin/appointments/${id}`);
    return response.data;
  },

  getUserAppointments: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },
};