import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

type ToastType = "success" | "error" | "info";

interface ToastOptions {
  text: string;
  type?: ToastType;
  duration?: number;
}

export const showToast = ({
  text,
  type = "info",
  duration = 3000,
}: ToastOptions) => {
  const backgroundMap: Record<ToastType, string> = {
    success: "linear-gradient(to right, #22c55e, #16a34a)", 
    error: "linear-gradient(to right, #ef4444, #dc2626)",   
    info: "linear-gradient(to right, #0ea5e9, #0284c7)",    
  };

  Toastify({
    text,
    duration,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: backgroundMap[type],
    },
  }).showToast();
};
