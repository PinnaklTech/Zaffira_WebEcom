import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentService, AppointmentRequest } from '@/services/appointmentService';

interface AppointmentState {
  appointments: any[];
  currentAppointment: any;
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  currentAppointment: null,
  loading: false,
  error: null,
};

// Async thunks
export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (data: AppointmentRequest, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const requestData = {
        ...data,
        userId: state.auth.user?._id,
        guestId: !state.auth.user ? state.cart.guestId : undefined,
      };
      const appointment = await appointmentService.createAppointment(requestData);
      return appointment;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create appointment');
    }
  }
);

export const fetchAppointment = createAsyncThunk(
  'appointments/fetchAppointment',
  async (id: string, { rejectWithValue }) => {
    try {
      const appointment = await appointmentService.getAppointment(id);
      return appointment;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointment');
    }
  }
);

// Admin actions
export const fetchAllAppointments = createAsyncThunk(
  'appointments/fetchAllAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const appointments = await appointmentService.getAllAppointments();
      return appointments;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  'appointments/updateAppointmentStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const appointment = await appointmentService.updateAppointmentStatus(id, status);
      return appointment;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update appointment');
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  'appointments/deleteAppointment',
  async (id: string, { rejectWithValue }) => {
    try {
      await appointmentService.deleteAppointment(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete appointment');
    }
  }
);

export const fetchUserAppointments = createAsyncThunk(
  'appointments/fetchUserAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const appointments = await appointmentService.getUserAppointments();
      return appointments;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentAppointment: (state) => {
      state.currentAppointment = null;
    },
  },
  extraReducers: (builder) => {
    // Create Appointment
    builder
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAppointment = action.payload;
        // Add the new appointment to the appointments list
        state.appointments.unshift(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Appointment
    builder
      .addCase(fetchAppointment.fulfilled, (state, action) => {
        state.currentAppointment = action.payload;
      });

    // Fetch All Appointments (Admin)
    builder
      .addCase(fetchAllAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAllAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Appointment Status
    builder
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      });

    // Delete Appointment
    builder
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.filter(a => a._id !== action.payload);
      });

    // Fetch User Appointments
    builder
      .addCase(fetchUserAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchUserAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;