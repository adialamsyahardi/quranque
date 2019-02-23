var CACHE_NAME = 'quranque-cache-v1-updated'
var urlsToCache = [
  '/',
  '/info.html',
  '/fallback.json',
  '/css/styles.css',
  '/js/jquery.min.js',
  '/js/menu.js',
  '/js/main.js',
  '/js/audiojs/audio.min.js',
  '/js/audiojs/audiojs.swf',
  '/js/audiojs/player-graphics.gif',
  '/images/back.png',
  '/images/info.png',
  '/favicon.ico'
];

self.addEventListener('install', function(event){
  //Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache){
      console.log('In install service serviceWorker, cache opened!');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event){

  var request = event.request
  var url = new URL(request.url)

  //pisahkan api(json) dan internal(js bawaan)
  if(url.origin === location.origin){
    event.respondWith(
      caches.match(request).then(function(response){
        return response || fetch(request)
      })
    );
  }
  else {
    event.respondWith(
      caches.open('quranque-cache').then(function(cache){
        return fetch(request).then(function(liveResponse){
          cache.put(request, liveResponse.clone())
          return liveResponse
        }).catch(function(){
          return caches.match(request).then(function(response){
            if(response) return response
            return caches.match('/fallback.json')
          })
        })
      })
    )
  }
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(cacheNames){
      return Promise.all(
        cacheNames.filter(function(cacheName){
          return cacheName != CACHE_NAME
        }).map(function(cacheName){
          return caches.delete(cacheName)
        })
      );
    })
  );
});
