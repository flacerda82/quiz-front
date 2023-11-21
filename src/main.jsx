import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const root = document.getElementById('root');
const rootElement = createRoot(root);

rootElement.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);