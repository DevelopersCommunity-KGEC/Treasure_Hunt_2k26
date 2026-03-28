'use client'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const InstallPWAButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setVisible(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setVisible(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled as EventListener);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className='border-[1px] border-gray-400 rounded-lg'>
        <button className='p-2' onClick={handleInstallClick}>
            Install TH-KGEC
        </button>
    </div>
  );

  function handleInstallClick(){
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          toast.info("Treasure Hunt installing...")
        }
        setDeferredPrompt(null);
      });
    }
  };
};

export default InstallPWAButton;

