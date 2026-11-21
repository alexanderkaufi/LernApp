const CACHE_NAME = 'kluug-v4';
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './assets/icon.svg',
  './data/cheatsheets.js',
  './data/english.js',
  './data/fractions.js',
  './data/geometry.js',
  './data/words.js',
  './data/science.js',
  './data/subjects.js',
  './src/cheatsheets.js',
  './src/core/audio.js',
  './src/core/math.js',
  './src/core/state.js',
  './src/core/store.js',
  './src/core/ui.js',
  './src/profile.js',
  './src/stations/pizza.js',
  './src/stations/lab.js',
  './src/stations/duel.js',
  './src/stations/quest.js',
  './src/stations/sprint.js',
  './src/stations/geometryLab.js',
  './src/stations/wordsLab.js',
  './src/stations/englishLab.js',
  './src/stations/scienceLab.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch(() => {})
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(keys.filter(key => key !== CACHE_NAME).map(oldKey => caches.delete(oldKey)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
