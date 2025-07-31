import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { consultationService, ConsultationRequest } from '@/services/consultationService';

interface ConsultationState {
  consultations: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ConsultationState = {
  consultations: [],
  loading: false,
  error: null,
};

export const fetchUserConsultations = createAsyncThunk(
  'consultations/fetchUserConsultations',
  async (_, { rejectWithValue }) => {
    try {
      const consultations = await consultationService.getUserConsultations();
      return consultations;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch consultations');
    }
  }
);

const consultationSlice = createSlice({
  name: 'consultations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserConsultations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserConsultations.fulfilled, (state, action) => {
        state.loading = false;
        state.consultations = action.payload;
      })
      .addCase(fetchUserConsultations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default consultationSlice.reducer; 