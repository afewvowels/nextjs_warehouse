var CACHE = 'cache-update-and-refresh';

self.addEventListener('install', function(evt) {
    console.log('the service worker is being installed');

    evt.waitUntil(precache());
})

self.addEventListener('fetch', function(evt) {
    console.log('the service worker is serving the assets');
    evt.respondWith(fromNetwork(evt.request, 400).catch(function() {
        return fromCache(evt.request);
    }));
});

function precache() {
    return caches.open(CACHE).then(function (cache) {
        return cache.addAll([
            './controlled.html',
            './asset'
        ]);
    });
}

function fromNetwork(request, timeout) {
    return new Promise(function(fulfill, reject) {
        var timeoutId = setTimeout(reject, timeout);

        fetch(request).then(function(response) {
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject);
    });
}

function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match');
        });
    });
}