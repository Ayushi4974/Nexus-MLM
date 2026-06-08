import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Common Components
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import UserPanelLayout from './components/Common/UserPanelLayout';
import LenisProvider from './components/Common/LenisProvider';
import PageTransition from './components/Common/PageTransition';

// Public Pages
import Home from './pages/Public/Home';
import About from './pages/Public/About';
import CompensationPlan from './pages/Public/CompensationPlan';
import Contact from './pages/Public/Contact';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// User Panel Pages
import Dashboard from './pages/UserPanel/Dashboard';
import DirectTeam from './pages/UserPanel/DirectTeam';
import GenealogyTree from './pages/UserPanel/GenealogyTree';
import Incomes from './pages/UserPanel/Incomes';
import Wallet from './pages/UserPanel/Wallet';
import FundTransfer from './pages/UserPanel/FundTransfer';
import Withdrawals from './pages/UserPanel/Withdrawals';
import Packages from './pages/UserPanel/Packages';
import Notifications from './pages/UserPanel/Notifications';
import Profile from './pages/UserPanel/Profile';
import Support from './pages/UserPanel/Support';

// Admin Panel Layout & Pages
import AdminPanelLayout from './components/Common/AdminPanelLayout';
import AdminDashboard from './pages/AdminPanel/AdminDashboard';
import AdminUsers from './pages/AdminPanel/AdminUsers';
import AdminWithdrawals from './pages/AdminPanel/AdminWithdrawals';
import AdminPackages from './pages/AdminPanel/AdminPackages';
import AdminTransactions from './pages/AdminPanel/AdminTransactions';
import AdminBroadcast from './pages/AdminPanel/AdminBroadcast';

// Public layout with sticky header and footer
const PublicLayout = () => {
  return (
    <PageTransition>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div style={{ flexGrow: 1 }}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <LenisProvider>
        <Router>
          <Routes>
            {/* Public Marketing Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/compensation" element={<CompensationPlan />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Standalone Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Secure User Dashboard Panel Routes */}
            <Route element={<UserPanelLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Team routes */}
              <Route path="/team/direct" element={<DirectTeam />} />
              <Route path="/team/genealogy" element={<GenealogyTree />} />

              {/* Income routes (separate pages using unified component) */}
              <Route path="/income/direct" element={<Incomes />} />
              <Route path="/income/binary" element={<Incomes />} />
              <Route path="/income/level" element={<Incomes />} />
              <Route path="/income/roi" element={<Incomes />} />
              <Route path="/income/reward" element={<Incomes />} />

              {/* Wallet routes */}
              <Route path="/wallet/overview" element={<Wallet />} />
              <Route path="/wallet/transfer" element={<FundTransfer />} />
              <Route path="/wallet/history" element={<Wallet />} />

              {/* General panel sections */}
              <Route path="/packages" element={<Packages />} />
              <Route path="/withdrawals" element={<Withdrawals />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/support" element={<Support />} />
            </Route>

            {/* Secure Admin Dashboard Panel Routes */}
            <Route element={<AdminPanelLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
              <Route path="/admin/packages" element={<AdminPackages />} />
              <Route path="/admin/transactions" element={<AdminTransactions />} />
              <Route path="/admin/broadcast" element={<AdminBroadcast />} />
            </Route>
          </Routes>
        </Router>
      </LenisProvider>
    </AuthProvider>
  );
};

export default App;
