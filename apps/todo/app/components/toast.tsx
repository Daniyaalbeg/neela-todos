import { Toaster } from "sonner";

export const SonnerToast = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          backgroundColor: "#333333",
          color: "#D4D4D8",
          borderColor: "#333333",
        },
      }}
    />
  );
};
