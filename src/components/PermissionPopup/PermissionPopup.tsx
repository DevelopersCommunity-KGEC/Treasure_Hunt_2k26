import { isPWAInstalled } from '@/utils/isPWAInstalled';
import { useState, useEffect } from 'react';

const PermissionPopup: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (isPWAInstalled()) {
      setShowPopup(true);
    }
  }, []);

  const handlePermissionRequest = async () => {
    // Example: Request Notification permission
    const notificationPermission = await Notification.requestPermission();
    console.log('Notification permission:', notificationPermission);

    // Example: Request Geolocation permission
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Geolocation permission granted:', position);
      },
      (error) => {
        console.error('Geolocation permission denied:', error);
      }
    );

    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div style={popupStyles}>
      <h2>Permissions Required</h2>
      <p>We need your permission to provide the best experience.</p>
      <button onClick={handlePermissionRequest}>Grant Permissions</button>
      <button onClick={() => setShowPopup(false)}>Not Now</button>
    </div>
  );
};

const popupStyles = {
  position: 'fixed' as 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '20px',
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  zIndex: 1000,
};

export default PermissionPopup;
