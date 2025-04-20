import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Layout } from './components/layout/Layout';
import { WalletContext, UserRole } from './contexts/WalletContext';
import { HomePage } from './pages/HomePage';
import { RegistrationPage } from './pages/RegistrationPage';
import { TransferPage } from './pages/TransferPage';
import { LookupPage } from './pages/LookupPage';
import { DashboardPage } from './pages/DashboardPage';

// Demo accounts for testing
const ADMIN_ID = 'ADMIN123';
const VALID_OWNER_IDS = ['OWNER001', 'OWNER002', 'OWNER003'];

const DEMO_ACCOUNTS = {
  admin: {
    address: '0x7ac4F3F51e9c79532Abcd1234',
    role: 'admin' as UserRole,
  },
  owner: {
    address: '0x9ef2B3C51e9c79532Efgh5678',
    role: 'owner' as UserRole,
  },
};

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [userRole, setUserRole] = useState<UserRole>(null);

  const connectWallet = async (role: UserRole, id: string) => {
    if (role === 'admin' && id !== ADMIN_ID) {
      throw new Error('Invalid admin ID');
    }
    
    if (role === 'owner' && !VALID_OWNER_IDS.includes(id)) {
      throw new Error('Invalid owner ID');
    }

    const account = role === 'admin' ? DEMO_ACCOUNTS.admin : DEMO_ACCOUNTS.owner;
    setWalletConnected(true);
    setWalletAddress(account.address);
    setUserRole(account.role);
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
    setUserRole(null);
  };

  return (
    <WalletContext.Provider 
      value={{ 
        connected: walletConnected, 
        address: walletAddress,
        role: userRole,
        connect: connectWallet, 
        disconnect: disconnectWallet 
      }}
    >
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/register" 
            element={
              userRole === 'admin' ? (
                <RegistrationPage />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/transfer" 
            element={
              userRole === 'owner' ? (
                <TransferPage />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route path="/lookup" element={<LookupPage />} />
          <Route 
            path="/dashboard" 
            element={
              walletConnected ? (
                <DashboardPage />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
      </Layout>
    </WalletContext.Provider>
  );
}

export default App;