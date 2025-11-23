const CACHE_NAME = 'driver-money-manager-v4';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './constants.ts',
  './hooks/useLocalStorage.ts',
  './contexts/AppContext.tsx',
  './services/geminiService.ts',
  './components/ui/Card.tsx',
  './components/layout/BottomNav.tsx',
  './components/dashboard/Dashboard.tsx',
  './components/dashboard/AdminPanel.tsx',
  './components/transactions/TransactionHistory.tsx',
  './components/transactions/AddTransaction.tsx',
  './components/transactions/TransactionDetail.tsx',
  './components/transactions/AddTransactionChoice.tsx',
  './components/reports/MonthlyReport.tsx',
  './components/settings/Settings.tsx',
  './components/receivables/ReceivablesList.tsx',
  './components/receivables/AddReceivable.tsx',
  './components/receivables/ReceivableDetail.tsx',
  './components/payables/PayablesList.tsx',
  './components/payables/AddPayable.tsx',
  './components/payables/PayableDetail.tsx',
  './components/pwa/InstallPWAButton.tsx'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => caches.match('./index.html'));
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});