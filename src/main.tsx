import './styles.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './RootApp.tsx';
import './game-skin.css';
import './graphical-ui.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
