import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:5050/api';

// Async Thunks

export const fetchEquipment = createAsyncThunk(
    'equipment/fetchAll',
    async (filters, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/equipment`, {
                params: filters,
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

export const fetchEquipmentById = createAsyncThunk(
    'equipment/fetchById',
    async (id, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/equipment/${id}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

export const createBooking = createAsyncThunk(
    'rental/book',
    async ({ equipmentId, startDate, endDate }, thunkAPI) => {
        try {
            const response = await axios.post(
                `${API_URL}/rental/book`,
                { equipmentId, startDate, endDate },
                { withCredentials: true }
            );
            toast.success('Booking requested successfully!');
            return response.data;
        } catch (error) {
            toast.error(error.response.data.message || 'Booking failed');
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

export const fetchMyRentals = createAsyncThunk(
    'rental/fetchMine',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${API_URL}/rental/my-rentals`, { withCredentials: true });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

export const addEquipment = createAsyncThunk(
    'equipment/add',
    async (equipmentData, thunkAPI) => {
        try {
            const response = await axios.post(
                `${API_URL}/equipment`,
                equipmentData,
                { withCredentials: true }
            );
            toast.success('Equipment listed successfully!');
            return response.data;
        } catch (error) {
            toast.error(error.response.data.message || 'Failed to add equipment');
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
);

// Slice

const equipmentSlice = createSlice({
    name: 'equipment',
    initialState: {
        items: [],
        currentEquipment: null,
        myRentals: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentEquipment: (state) => {
            state.currentEquipment = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchEquipment.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEquipment.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchEquipment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch By ID
            .addCase(fetchEquipmentById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEquipmentById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentEquipment = action.payload;
            })
            // My Rentals
            .addCase(fetchMyRentals.fulfilled, (state, action) => {
                state.myRentals = action.payload;
            });
    },
});

export const { clearCurrentEquipment } = equipmentSlice.actions;
export default equipmentSlice.reducer;
