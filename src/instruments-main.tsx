import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { InstrumentsDashboard } from './components/InstrumentsDashboard';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <InstrumentsDashboard />
  </React.StrictMode>,
);
