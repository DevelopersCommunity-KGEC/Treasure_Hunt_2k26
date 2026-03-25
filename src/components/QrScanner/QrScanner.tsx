// // components/QRScanner.tsx
// import { useEffect, useRef } from 'react';
// import jsQR from 'jsqr';
// import styles from './style.module.scss';
// import {toast} from 'sonner';

// interface QRScannerProps {
//   onScan: (data: string) => void;
// }

// const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
//   useEffect(() => {
//     const startVideo = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           await videoRef.current.play();
//         }
//       } catch (err) {
//         console.log("THE ERROR", err)
//         toast.error('Failed to access camera please give permissions', {
//           duration : 800
//         });
//       }
//     };

//     startVideo();

//   }, []);

//   useEffect(() => {
//     const scanQRCode = () => {
//       if (videoRef.current && canvasRef.current) {
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');

//         if (context && videoRef.current.readyState === 4) {
//           canvas.width = videoRef.current.videoWidth;
//           canvas.height = videoRef.current.videoHeight;
//           context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

//           const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
//           const code = jsQR(imageData.data, imageData.width, imageData.height);

//           if (code) {
//             onScan(code.data);
//             return;
//           }
//         }
//       }
//       requestAnimationFrame(scanQRCode);
//     };

//     scanQRCode();
//   }, [onScan]);

//   return (
//     <div className={styles.scannerContainer}>
//       <video ref={videoRef} className={styles.video} />
//       <canvas ref={canvasRef} className={styles.canvas} />
//       <div className={styles.frame}>
//         <div className={styles.frameCorner}></div>
//         <div className={styles.frameCorner}></div>
//         <div className={styles.frameCorner}></div>
//         <div className={styles.frameCorner}></div>
//       </div>
//     </div>
//   );
// };

// export default QRScanner;


// components/QRScanner.tsx
// import { useEffect, useRef } from 'react';
// import jsQR from 'jsqr';
// import styles from './style.module.scss';
// import {toast} from 'sonner';

// interface QRScannerProps {
//   onScan: (data: string) => void;
// }

// const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
//   useEffect(() => {
//     const startVideo = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           await videoRef.current.play();
//         }
//       } catch (err) {
//         console.log("THE ERROR", err)
//         toast.error('Failed to access camera please give permissions', {
//           duration : 800
//         });
//       }
//     };

//     startVideo();

//   }, []);

//   useEffect(() => {
//     const scanQRCode = () => {
//       if (videoRef.current && canvasRef.current) {
//         const canvas = canvasRef.current;
//         const context = canvas.getContext('2d');

//         if (context && videoRef.current.readyState === 4) {
//           canvas.width = videoRef.current.videoWidth;
//           canvas.height = videoRef.current.videoHeight;
//           context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

//           const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
//           const code = jsQR(imageData.data, imageData.width, imageData.height);

//           if (code) {
//             onScan(code.data);
//             return;
//           }
//         }
//       }
//       requestAnimationFrame(scanQRCode);
//     };

//     scanQRCode();
//   }, [onScan]);

//   return (
//     <div className={styles.scannerContainer}>
//       <video ref={videoRef} className={styles.video} />
//       <canvas ref={canvasRef} className={styles.canvas} />
//       <div className={styles.frame}>
//         <div className={styles.frameCorner}></div>
//         <div className={styles.frameCorner}></div>
//         <div className={styles.frameCorner}></div>
//         <div className={styles.frameCorner}></div>
//       </div>
//     </div>
//   );
// };

// export default QRScanner;


import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import styles from './style.module.scss';
import { toast } from 'sonner';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }

    onClose?.();
  };

  useEffect(() => {
    const startVideo = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('getUserMedia is not supported in this browser');
        }

        const constraints: MediaStreamConstraints = {
          video: { 
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 }
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          videoRef.current.addEventListener('loadedmetadata', () => {
            videoRef.current?.play().catch(playError => {
              console.error('Video play error:', playError);
              setCameraError('Failed to start video stream');
              toast.error('Could not start camera', { duration: 1000 });
            });
          });

          videoRef.current.addEventListener('error', (e) => {
            console.error('Video error:', e);
            setCameraError('Video stream error');
            toast.error('Camera stream error', { duration: 1000 });
          });
        }
      } catch (err) {
        console.error('Camera access error:', err);
        
        if (err instanceof DOMException) {
          switch (err.name) {
            case 'NotAllowedError':
              setCameraError('Camera access was denied. Please check your browser permissions.');
              toast.error('Camera access denied', { duration: 2000 });
              break;
            case 'NotFoundError':
              setCameraError('No camera found on this device.');
              toast.error('No camera detected', { duration: 2000 });
              break;
            case 'NotReadableError':
              setCameraError('Camera is already in use or blocked.');
              toast.error('Camera is unavailable', { duration: 2000 });
              break;
            default:
              setCameraError('Failed to access camera. Unknown error.');
              toast.error('Camera access failed', { duration: 2000 });
          }
        } else {
          setCameraError('Failed to access camera. Please check permissions.');
          toast.error('Camera access error', { duration: 2000 });
        }
      }
    };

    startVideo();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopCamera();
      }
    };

    const handleBeforeUnload = () => {
      stopCamera();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);

      stopCamera();
    };
  }, [onClose]);

  useEffect(() => {
    let animationFrameId: number;

    const scanQRCode = () => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        if (context && videoRef.current.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) {
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          
          context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code) {
            onScan(code.data);
            return;
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(scanQRCode);
    };

    scanQRCode();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [onScan]);

  if (cameraError) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{cameraError}</p>
        <button 
          onClick={() => {
            setCameraError(null);
            window.location.reload();
          }} 
          className={styles.retryButton}
        >
          Retry Camera Access
        </button>
      </div>
    );
  }

  return (
    <div className={styles.scannerContainer}>
      <video 
        ref={videoRef} 
        className={styles.video} 
        playsInline 
        muted 
        autoPlay
      />
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.frame}>
        <div className={styles.frameCorner}></div>
        <div className={styles.frameCorner}></div>
        <div className={styles.frameCorner}></div>
        <div className={styles.frameCorner}></div>
      </div>
    </div>
  );
};

export default QRScanner;