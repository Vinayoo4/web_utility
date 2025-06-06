import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
<<<<<<< HEAD
  base: '/',
=======
  base: '/web_utility/',
>>>>>>> c8f19eb38597ea21acda8a916620381e1b0201c6
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
