import { api } from './api';

export interface Supplier {
  _id: string;
  name: string;
  phoneNumber: string;
  emailId: string;
  certification?: string;
  location?: string;
  specialty?: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierData {
  name: string;
  phoneNumber: string;
  emailId: string;
  certification?: string;
  location?: string;
  specialty?: string;
}

export interface UpdateSupplierData extends Partial<CreateSupplierData> {}

class SupplierService {
  async getSuppliers(): Promise<Supplier[]> {
    const response = await api.get('/suppliers');
    return response.data;
  }

  async getSupplierById(id: string): Promise<Supplier> {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  }

  async createSupplier(data: CreateSupplierData): Promise<Supplier> {
    const response = await api.post('/suppliers', data);
    return response.data;
  }

  async updateSupplier(id: string, data: UpdateSupplierData): Promise<Supplier> {
    const response = await api.put(`/suppliers/${id}`, data);
    return response.data;
  }

  async deleteSupplier(id: string): Promise<void> {
    await api.delete(`/suppliers/${id}`);
  }
}

export const supplierService = new SupplierService(); 