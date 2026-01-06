import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import FarmerLayout from "../layouts/FarmerLayout";
import HomeFeedPage from "../pages/HomeFeedPage";
import HomeFeedLayout from "../layouts/HomeFeedLayout";
import AuthLayout from "../layouts/AuthLayout";
import SignInPage from "../pages/SignInPage";
import Signup from "../pages/SignUpPage";
import FarmerHomePage from "../pages/FarmerHomePage";
import AnalyticsPage from "../pages/AnalyticsPage";
import MessageLayout from "../components/message/MessageLayout";
import BuyerLayout from "../layouts/BuyerLayout";
import BuyerHomePage from "../pages/BuyerHomePage";
import BuyerCartPage from "../components/buyer/BuyerCartPage";
import PaymentSimulationPage from "../pages/PaymentSimulationPage";
import NotificationsPage from "../pages/NotificationsPage";
import DiseaseDetectionPage from "../pages/farmer/DiseaseDetectionPage";

// Admin Imports
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageProducts from "../pages/admin/ManageProducts";
import ManagePrices from "../pages/admin/ManagePrices";
import ManageOrders from "../pages/admin/ManageOrders";
import BroadcastNotifications from "../pages/admin/BroadcastNotifications";
import InsuranceClaimForm from "../components/insurance/InsuranceClaimForm";
import FarmerClaimsList from "../components/insurance/FarmerClaimsList";
import AdminClaimsDashboard from "../components/insurance/AdminClaimsDashboard";

// Rental Imports
import RentalMarketplace from "../pages/rental/RentalMarketplace";
import EquipmentDetails from "../pages/rental/EquipmentDetails";
import RentalDashboard from "../pages/rental/RentalDashboard";


const routers = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="prices" element={<ManagePrices />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="notifications" element={<BroadcastNotifications />} />
        <Route path="insurance" element={<AdminClaimsDashboard />} />
      </Route>

      {/* Auth Routes - Independent of MainLayout if simpler, but here nested is fine if handled right */}

      <Route path="/" element={<MainLayout />}>
        <Route path="auth" element={<AuthLayout />}>
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<Signup />} />
        </Route>
        <Route element={<HomeFeedLayout />}>
          <Route index element={<HomeFeedPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
        <Route path="rental" element={<RentalMarketplace />} />
        <Route path="rental/:id" element={<EquipmentDetails />} />
        <Route path="rental/dashboard" element={<RentalDashboard />} />

        <Route path="farmer" element={<FarmerLayout />}>
          <Route path=":farmerId" element={<FarmerHomePage />} />
          <Route
            path=":farmerId/messages/:anotherId"
            element={<MessageLayout />}
          />
          <Route path=":farmerId/disease-detection" element={<DiseaseDetectionPage />} />
          <Route path=":farmerId/insurance" element={<FarmerClaimsList />} />
          <Route path=":farmerId/insurance/new" element={<InsuranceClaimForm />} />
        </Route>
        <Route path="buyer" element={<BuyerLayout />}>
          <Route path=":buyerId" element={<BuyerHomePage />} />
          <Route path=":buyerId/cart" element={<BuyerCartPage />} />
          <Route
            path=":buyerId/messages/:anotherId"
            element={<MessageLayout />}
          />
          <Route path="payment-simulation/:orderId" element={<PaymentSimulationPage />} />
        </Route>
      </Route>
    </>
  )
);

export default routers;
