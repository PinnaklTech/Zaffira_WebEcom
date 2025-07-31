import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supplierService, CreateSupplierData, UpdateSupplierData } from '@/services/supplierService';

interface SupplierState {
  suppliers: any[];
  currentSupplier: any;
  loading: boolean;
  error: string | null;
}

const initialState: SupplierState = {
  suppliers: [],
  currentSupplier: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchSuppliers',
  async (_, { rejectWithValue }) => {
    try {
      const suppliers = await supplierService.getSuppliers();
      return suppliers;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch suppliers');
    }
  }
);

export const fetchSupplierById = createAsyncThunk(
  'suppliers/fetchSupplierById',
  async (id: string, { rejectWithValue }) => {
    try {
      const supplier = await supplierService.getSupplierById(id);
      return supplier;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch supplier');
    }
  }
);

export const createSupplier = createAsyncThunk(
  'suppliers/createSupplier',
  async (supplierData: CreateSupplierData, { rejectWithValue }) => {
    try {
      const supplier = await supplierService.createSupplier(supplierData);
      return supplier;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create supplier');
    }
  }
);

export const updateSupplier = createAsyncThunk(
  'suppliers/updateSupplier',
  async ({ id, data }: { id: string; data: UpdateSupplierData }, { rejectWithValue }) => {
    try {
      const supplier = await supplierService.updateSupplier(id, data);
      return supplier;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update supplier');
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  'suppliers/deleteSupplier',
  async (id: string, { rejectWithValue }) => {
    try {
      await supplierService.deleteSupplier(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete supplier');
    }
  }
);

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentSupplier: (state) => {
      state.currentSupplier = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Suppliers
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Supplier by ID
    builder
      .addCase(fetchSupplierById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupplierById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSupplier = action.payload;
      })
      .addCase(fetchSupplierById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentSupplier = null;
      });

    // Create Supplier
    builder
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.suppliers.push(action.payload);
      });

    // Update Supplier
    builder
      .addCase(updateSupplier.fulfilled, (state, action) => {
        const index = state.suppliers.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.suppliers[index] = action.payload;
        }
      });

    // Delete Supplier
    builder
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.suppliers = state.suppliers.filter(s => s._id !== action.payload);
      });
  },
});

export const { clearError, clearCurrentSupplier } = supplierSlice.actions;
export default supplierSlice.reducer; 