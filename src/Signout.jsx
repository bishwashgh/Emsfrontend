// src/Signout.jsx
import React from 'react';
import { auth } from './services/api';

function Signout({ onLogout }) {
  const handleSignOut = async () => {
    await auth.logout(); // Now handles both API call and cleanup
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <button
      className="signout-btn"
      onClick={handleSignOut}
      style={{
        marginTop: '10px',
        padding: '8px 16px',
        background: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '100%',
      }}
    >
      Sign Out
    </button>
  );
}

export default Signout;