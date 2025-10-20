import { toast } from 'sonner';

interface ErrorResponse {
  error: string;
  code?: string;
}

export const handleApiError = (error: any, customMessage?: string) => {
  // Network error
  if (!error.response) {
    toast.error(customMessage || 'Network error. Please check your connection.');
    return;
  }

  const status = error.response.status;
  const data: ErrorResponse = error.response.data;

  // Rate limit
  if (status === 429) {
    const resetDate = data.resetDate 
      ? new Date(data.resetDate).toLocaleString()
      : 'soon';
    
    toast.error(`Rate limit reached. Resets ${resetDate}`, {
      duration: 5000,
    });
    return;
  }

  // Auth errors
  if (status === 401) {
    toast.error('Session expired. Please sign in again.');
    // Redirect handled by axios interceptor
    return;
  }

  // Usage limit
  if (data.code === 'USAGE_LIMIT_REACHED') {
    toast.error(data.error, {
      duration: 7000,
      action: {
        label: 'Upgrade',
        onClick: () => window.location.href = '/settings',
      },
    });
    return;
  }

  // Generic error
  toast.error(customMessage || data.error || 'Something went wrong');
};

export const handleSuccess = (message: string) => {
  toast.success(message);
};
