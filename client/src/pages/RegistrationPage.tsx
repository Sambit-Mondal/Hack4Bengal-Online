import { FC, useContext, useState } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { LandForm } from '../components/LandForm';
import { Alert } from '../components/ui/Alert';
import { Notification } from '../components/ui/Notification';

export const RegistrationPage: FC = () => {
  const { connected } = useContext(WalletContext);
  const [isLoading, setIsLoading] = useState(false);
  const [resetKey, setResetKey] = useState(0); // to force-reset form
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'loading';
    message: string;
    description?: string;
  } | null>(null);

  const handleRegister = async (data: Record<string, string>) => {
    if (!connected) {
      setNotification({
        type: 'error',
        message: 'Wallet not connected',
        description: 'Please connect your wallet to register land.',
      });
      return;
    }

    setIsLoading(true);
    setNotification({
      type: 'loading',
      message: 'Processing',
      description: 'Registering land on the blockchain...',
    });

    // Simulate blockchain interaction
    setTimeout(() => {
      setIsLoading(false);
      setNotification({
        type: 'success',
        message: 'Registration Successful',
        description: `Land ID ${data.landId} has been successfully registered.`,
      });
      setResetKey(prev => prev + 1); // trigger reset of form
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1>Land Registration</h1>
        <p className="text-text-secondary mt-2">
          Register your land property securely on Ethereum.
        </p>
      </div>

      {!connected && (
        <Alert
          variant="warning"
          title="Connect Your Wallet"
          className="max-w-lg mx-auto mb-6"
        >
          Please connect your wallet to register land.
        </Alert>
      )}

      <LandForm
        key={resetKey} // resets form when key changes
        type="register"
        onSubmit={handleRegister}
        isLoading={isLoading}
      />

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          description={notification.description}
          duration={notification.type === 'loading' ? 0 : 5000}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};