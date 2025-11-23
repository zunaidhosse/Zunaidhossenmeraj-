
import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const InstallPWAButton: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isDismissed, setIsDismissed] = useState(localStorage.getItem('pwaInstallPromptDismissed') === 'true');

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            return;
        }
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
        } else {
            console.log('User dismissed the A2HS prompt');
        }
        setDeferredPrompt(null);
        handleDismiss();
    };

    const handleDismiss = () => {
        localStorage.setItem('pwaInstallPromptDismissed', 'true');
        setIsDismissed(true);
    };

    if (!deferredPrompt || isDismissed) {
        return null;
    }

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="install-dialog-title">
            <div className="bg-light-card dark:bg-dark-card backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg mx-auto p-6 text-center animate-slide-up">
                <button onClick={handleDismiss} className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                    <X size={20} />
                </button>
                <img src="./icon-192.png" alt="App Icon" className="w-16 h-16 mx-auto mb-4" />
                <h2 id="install-dialog-title" className="text-xl font-bold">Install App</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Add Driver Money Manager to your home screen for a better experience, including offline access.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleDismiss}
                        className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 font-semibold rounded-lg hover:opacity-80 transition-opacity"
                    >
                        Not Now
                    </button>
                    <button
                        onClick={handleInstallClick}
                        className="w-full flex items-center justify-center gap-2 text-white bg-gradient-to-br from-primary to-accent font-semibold py-3 px-4 rounded-lg shadow-lg hover:opacity-90 transition-opacity"
                    >
                        <Download size={20} /> Install App
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPWAButton;