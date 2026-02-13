// Network error handler to suppress external API errors
export const setupNetworkErrorHandler = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    
    // Check if it's a network error from external services
    if (error && typeof error === 'object') {
      const errorMessage = error.message || error.toString();
      
      // Suppress errors from external services that we don't control
      if (errorMessage.includes('skywork.ai') ||
          errorMessage.includes('chat_web') ||
          errorMessage.includes('pub/visit') ||
          errorMessage.includes('api.skywork.ai')) {
        console.warn('Suppressed external service error:', errorMessage);
        event.preventDefault();
        return;
      }
    }
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    const error = event.error;
    
    if (error && typeof error === 'object') {
      const errorMessage = error.message || error.toString();
      
      // Suppress errors from external services
      if (errorMessage.includes('skywork.ai') ||
          errorMessage.includes('chat_web') ||
          errorMessage.includes('pub/visit') ||
          errorMessage.includes('api.skywork.ai')) {
        console.warn('Suppressed external service error:', errorMessage);
        event.preventDefault();
        return;
      }
    }
  });

  // Override fetch to handle network errors gracefully
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);
      
      // Check if the request is to an external service we don't control
      const url = args[0]?.toString() || '';
      if (url.includes('skywork.ai') || url.includes('chat_web')) {
        // If it fails, just log and continue
        if (!response.ok) {
          console.warn('External service request failed:', url, response.status);
        }
      }
      
      return response;
    } catch (error) {
      const url = args[0]?.toString() || '';
      
      // Suppress errors from external services
      if (url.includes('skywork.ai') || url.includes('chat_web')) {
        console.warn('External service request failed:', url, error);
        // Return a mock response to prevent breaking the app
        return new Response('{}', { 
          status: 200, 
          statusText: 'OK',
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Re-throw other errors
      throw error;
    }
  };
};

export default setupNetworkErrorHandler;