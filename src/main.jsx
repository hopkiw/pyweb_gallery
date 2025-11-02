/* jshint esversion: 10 */

import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css'
import App from './App.jsx';

// Main entrypoint
const root = createRoot(document.body);
root.render(<App />);
