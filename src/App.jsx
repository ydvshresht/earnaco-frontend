import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

/* Auth */
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";

/* User Pages */
import Entry from "./pages/Entry";
import Test from "./pages/Test";
import ContestPage from "./pages/ContestPage";
import Leaderboard from "./pages/Leaderboard";
import ProfileHome from "./pages/ProfileHome";
import Profile from "./pages/Profile";
import MyEntry from "./pages/MyEntry";
import Wallet from "./pages/Wallet";
import BuyCoins from "./pages/BuyCoins";
import Transactions from "./pages/Transactions";
import Refer from "./pages/Refer";
import CustomerSupport from "./pages/CustomerSupport";
import MyTest from "./pages/MyTest";

/* Admin Pages */
import AdminDashboard from "./pages/AdminDashboard";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminFraud from "./pages/AdminFraud";
import CreateContestWizard from "./pages/CreateContestWizard";
import EditContestWizard from "./pages/EditContestWizard";
import ManageContests from "./pages/ManageContests";

/* Static */
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Refund from "./pages/Refund";
import ReferralPolicy from "./pages/ReferralPolicy";
import Disclaimer from "./pages/Disclaimer";

function App() {
  return (
    <div className="app-shell">
      <Routes>

        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset/:token" element={<Reset />} />

        {/* USER PROTECTED */}
        <Route path="/entry" element={<ProtectedRoute><Entry /></ProtectedRoute>} />
        <Route path="/contest/:contestId" element={<ProtectedRoute><ContestPage /></ProtectedRoute>} />
        <Route path="/test/:testId" element={<ProtectedRoute><Test /></ProtectedRoute>} />
        <Route path="/leaderboard/:testId" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfileHome /></ProtectedRoute>} />
        <Route path="/profile/details" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/my-entry" element={<ProtectedRoute><MyEntry /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
        <Route path="/buy-coins" element={<ProtectedRoute><BuyCoins /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/refer" element={<ProtectedRoute><Refer /></ProtectedRoute>} />
        <Route path="/my-test" element={<ProtectedRoute><MyTest /></ProtectedRoute>} />

        {/* ADMIN PROTECTED */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
        <Route path="/admin/fraud" element={<AdminRoute><AdminFraud /></AdminRoute>} />
        <Route path="/admin/create-contest-wizard" element={<AdminRoute><CreateContestWizard /></AdminRoute>} />
        <Route path="/admin/contests/:contestId/edit" element={<AdminRoute><EditContestWizard /></AdminRoute>} />
        <Route path="/admin/manage-contests" element={<AdminRoute><ManageContests /></AdminRoute>} />

        {/* PUBLIC */}
        <Route path="/support" element={<CustomerSupport />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/referral-policy" element={<ReferralPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />

      </Routes>
    </div>
  );
}

export default App;
