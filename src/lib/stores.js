import { writable } from 'svelte/store';

// Navigation route: 'login' | 'signup' | 'songs'
export const currentRoute = writable('login');

// Authenticated user state
export const currentUser = writable(null);

// Toast notification state
export const toast = writable({
  show: false,
  message: '',
  type: 'info', // 'success' | 'error' | 'info'
});

let toastTimeout;

export function showToast(message, type = 'info', duration = 3500) {
  if (toastTimeout) clearTimeout(toastTimeout);
  
  toast.set({
    show: true,
    message,
    type,
  });

  toastTimeout = setTimeout(() => {
    toast.set({ show: false, message: '', type: 'info' });
  }, duration);
}
