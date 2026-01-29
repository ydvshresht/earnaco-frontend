import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Entry from "./pages/Entry";
import ProtectedRoute from "./components/ProtectedRoute";
import Test from "./pages/Test";
import Leaderboard from "./pages/Leaderboard";
import ProfileHome from "./pages/ProfileHome";
import Profile from "./pages/Profile";
import ContestPage from "./pages/ContestPage";
import MyEntry from "./pages/MyEntry";
import Wallet from "./pages/Wallet";
import BuyCoins from "./pages/BuyCoins";
import Transactions from "./pages/Transactions";
import Refer from "./pages/Refer";
import CustomerSupport from "./pages/CustomerSupport";
import MyTest from "./pages/MyTest";
import AdminQuestions from "./pages/AdminQuestions";
import Verify from "./pages/Verify";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";
import AdminDashboard from "./pages/AdminDashboard";
import ManageQuestions from "./pages/ManageQuestions";
import ManageTests from "./pages/ManageTests";
import ManageContests from "./pages/ManageContests";
import AdminAnalytics from "./pages/AdminAnalytics";

import AdminFraud from "./pages/AdminFraud";
import CreateContest from "./pages/CreateContest";
import CreateTest from "./pages/CreateTest";

function App() {
  return (
     <div className="app-shell">
     
    
  


    <Routes>
      
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
<Route path="/verify/:token" element={<Verify />} />
<Route path="/forgot" element={<Forgot/>}/>
<Route path="/reset/:token" element={<Reset/>}/>

      <Route
        path="/entry"
        element={
          <ProtectedRoute>
            <Entry />
          </ProtectedRoute>
        }
      />

      <Route
        path="/test/:testId"
        element={
          <ProtectedRoute>
            <Test />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leaderboard/:testId"
        element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/details"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
  path="/contest/:contestId"
  element={
    <ProtectedRoute>
      <ContestPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/my-entry"
  element={
    <ProtectedRoute>
      <MyEntry />
    </ProtectedRoute>
  }
/>
<Route
  path="/wallet"
  element={
    <ProtectedRoute>
      <Wallet />
    </ProtectedRoute>
  }
/>

<Route
  path="/buycoins"
  element={
    <ProtectedRoute>
      <BuyCoins />
    </ProtectedRoute>
  }
/>
<Route
  path="/transactions"
  element={
    <ProtectedRoute>
      <Transactions />
    </ProtectedRoute>
  }
/>
<Route
  path="/refer"
  element={
    <ProtectedRoute>
      <Refer />
    </ProtectedRoute>
  }
/>
<Route path="/support" element={<CustomerSupport />} />
<Route path="/my-test" element={<MyTest />} />
<Route path="/admin/questions" element={<AdminQuestions />} />
<Route path="/admin" element={<AdminDashboard />} />
<Route path="/admin/manage-questions" element={<ManageQuestions />} />
<Route path="/admin/manage-tests" element={<ManageTests />} />
<Route path="/admin/manage-contests" element={<ManageContests />} />
<Route path="/admin/create-test" element={<CreateTest />} />
<Route
  path="/admin/create-contest"
  element={<CreateContest />}
/>
<Route path="/admin/analytics" element={<AdminAnalytics />} />

<Route path="/admin/fraud" element={<AdminFraud />} />

    </Routes>
    </div>
  );
}

export default App;
