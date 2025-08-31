declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      isMetaMask?: boolean;
      selectedAddress?: string;
      chainId?: string;
      // Add event listener methods
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      // Add other methods you might use
      enable?: () => Promise<string[]>;
      send?: (method: string, params?: any[]) => Promise<any>;
    };
  }
}

export {};