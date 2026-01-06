import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import notificationReducer from "../features/notification/notificationSlice";
import equipmentReducer from "../features/equipment/equipmentSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
    equipment: equipmentReducer,
  },
});

export default store;
