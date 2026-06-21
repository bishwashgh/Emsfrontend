// src/Signout.jsx
import React from 'react';
import { auth } from './services/api';

export default function Signout({ onLogout }) {
  const handleSignout = () => {
    auth.logout();
    if (typeof onLogout === 'function') onLogout();
    // Optionally redirect:
    // window.location.href = '/'; // if you want a hard redirect
  };

  return (
    <button className="signout-btn" onClick={handleSignout}>
      Sign out
    </button>
  );
}