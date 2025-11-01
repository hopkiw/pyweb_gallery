/* jshint esversion: 10 */

import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.js';

// Main entrypoint
const root = createRoot(document.body);
root.render(<App />);
