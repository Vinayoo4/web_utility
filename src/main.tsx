import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AppErrorBoundary } from './components/ErrorBoundary';
import './index.css';

<<<<<<< HEAD
=======


>>>>>>> c8f19eb38597ea21acda8a916620381e1b0201c6
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>
);