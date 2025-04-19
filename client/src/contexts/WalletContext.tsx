import { createContext } from 'react';
import { ethers } from 'ethers';

export type UserRole = 'admin' | 'owner' | null;

interface WalletContextType {
  connected: boolean;
  address: string;
  role: UserRole;
  connect: (role: UserRole, id: string) => Promise<void>;
  disconnect: () => void;
  signer: ethers.Signer | null; // Add the signer property
}

export const WalletContext = createContext<WalletContextType>({
  connected: false,
  address: '',
  role: null,
  connect: async () => {},
  disconnect: () => {},
  signer: null,
});