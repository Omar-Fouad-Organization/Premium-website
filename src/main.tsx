import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import setupNetworkErrorHandler from './utils/networkErrorHandler'

// Initialize network error handler to suppress external service errors
setupNetworkErrorHandler();

createRoot(document.getElementById("root")!).render(<App />);
