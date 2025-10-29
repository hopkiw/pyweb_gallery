/* jshint esversion: 10 */

import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.js';

// Main entrypoint
const root = createRoot(document.body);
root.render(<App />);

window.onload = () => {
  // TODO: the form component should focus itself on first load
  document.getElementById('form-include-tags-field').focus();
};
