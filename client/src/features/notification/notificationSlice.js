import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

// Async thunks
export const fetchNotifications = createAsyncThunk(
    "notifications/fetchNotifications",
    async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/api/notifications?page=${page}&limit=${limit}`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch notifications");
        }
    }
);

export const fetchUnreadCount = createAsyncThunk(
    "notifications/fetchUnreadCount",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get("/api/notifications/unread-count");
            return res.data.count;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch unread count");
        }
    }
);

export const markNotificationAsRead = createAsyncThunk(
    "notifications/markAsRead",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.patch(`/api/notifications/${id}/read`);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to mark as read");
        }
    }
);

export const markAllNotificationsAsRead = createAsyncThunk(
    "notifications/markAllAsRead",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.patch("/api/notifications/read-all");
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to mark all as read");
        }
    }
);

export const deleteNotification = createAsyncThunk(
    "notifications/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`/api/notifications/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete notification");
        }
    }
);

const notificationSlice = createSlice({
    name: "notifications",
    initialState: {
        items: [],
        unreadCount: 0,
        loading: false,
        error: null,
        totalPages: 1,
        currentPage: 1,
    },
    reducers: {
        addNotification: (state, action) => {
            state.items.unshift(action.payload);
            state.unreadCount += 1;
        },
        setUnreadCount: (state, action) => {
            state.unreadCount = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Notifications
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                // If it's the first page, replace items. If scrolling/pagination, you might want to append.
                // For simplicity, we'll replace for now or handle pagination in the component.
                // Let's replace to keep it simple for the basic list view.
                state.items = action.payload.notifications || [];
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Unread Count
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload;
            })
            // Mark as Read
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const index = state.items.findIndex((n) => n._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            // Mark All as Read
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.items.forEach((n) => {
                    n.isRead = true;
                });
                state.unreadCount = 0;
            })
            // Delete
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.items = state.items.filter((n) => n._id !== action.payload);
            });
    },
});

export const { addNotification, setUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;
