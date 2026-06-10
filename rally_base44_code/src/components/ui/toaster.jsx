import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      dir="rtl"
      toastOptions={{
        style: {
          fontFamily: 'Heebo, system-ui, sans-serif',
          borderRadius: '16px',
        },
      }}
    />
  );
}

export default Toaster;
