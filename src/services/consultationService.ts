import { api } from './api';

export interface ConsultationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jewelryType: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  images?: { url: string; name: string }[];
}

export const consultationService = {
  createConsultation: async (data: ConsultationRequest) => {
    const response = await api.post('/consultations', data);
    return response.data;
  },

  getUserConsultations: async () => {
    const response = await api.get('/consultations');
    return response.data;
  },
}; 