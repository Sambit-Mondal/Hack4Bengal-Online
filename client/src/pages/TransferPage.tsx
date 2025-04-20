import { FC, useContext, useState } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { Alert } from '../components/ui/Alert';
import { Notification } from '../components/ui/Notification';
import { TransferForm } from '../components/TransferForm';

export const TransferPage: FC = () => {
  const { connected } = useContext(WalletContext);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'loading';
    message: string;
    description?: string;
  } | null>(null);

  const [formData, setFormData] = useState<Record<string, string>>({
    ownerName: '',
    ownerEmail: '',
    landId: '',
    ownerAddress: '',
    area: '',
    locationHash: '',
    valuation: '',
    newOwnerAddress: '',
  });

  const handleTransfer = async (data: Record<string, string>) => {
    if (!connected) {
      setNotification({
        type: 'error',
        message: 'Wallet not connected',
        description: 'Please connect your wallet to transfer land ownership.',
      });
      return;
    }

    setIsLoading(true);
    setNotification({
      type: 'loading',
      message: 'Processing',
      description: 'Transferring land ownership on the blockchain...',
    });

    // Simulate blockchain interaction
    setTimeout(() => {
      setIsLoading(false);
      setNotification({
        type: 'success',
        message: 'Transfer Successful',
        description: `Land ID ${data.landId} has been transferred to ${data.newOwnerAddress}.`,
      });
      
      // Reset form fields after successful transfer
      setFormData({
        ownerName: '',
        ownerEmail: '',
        landId: '',
        ownerAddress: '',
        area: '',
        locationHash: '',
        valuation: '',
        newOwnerAddress: '',
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1>Transfer Land Ownership</h1>
        <p className="text-text-secondary mt-2">
          Securely transfer your land property to a new owner on the StarkNet blockchain
        </p>
      </div>

      {!connected && (
        <Alert 
          variant="warning" 
          title="Connect Your Wallet"
          className="max-w-lg mx-auto mb-6"
        >
          Please connect your StarkNet wallet to transfer land ownership on the blockchain.
        </Alert>
      )}

      <TransferForm 
        type="transfer" 
        onSubmit={handleTransfer}
        isLoading={isLoading} 
        formData={formData}  // Pass current form data to LandForm
        setFormData={setFormData}  // Pass the function to update the form data
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