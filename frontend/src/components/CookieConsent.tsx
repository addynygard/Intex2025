// src/components/CookieConsent.tsx
import { useState, useEffect } from 'react';
const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) setVisible(true);
  }, []);
  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false);
    // Example: Enable analytics script
    // window.gtag('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted' });
  };
  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setVisible(false);
  };
  if (!visible) return null;
  return (
    <div style={styles.container}>
      <p>This site uses cookies to enhance your experience. See our <a href="/PrivacyPolicy">Privacy Policy</a>.</p>
      <div style={styles.buttons}>
        <button onClick={handleAccept} style={styles.accept}>Accept</button>
        <button onClick={handleReject} style={styles.reject}>Reject</button>
      </div>
    </div>
  );
};
const styles = {
  container: {
    position: 'fixed' as const,
    bottom: 0,
    width: '100%',
    backgroundColor: '#222',
    color: '#fff',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1000,
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
  },
  accept: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
  },
  reject: {
    backgroundColor: '#F44336',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
  },
};
export default CookieConsent;

