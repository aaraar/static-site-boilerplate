const CORE_ASSETS = [
    '/',
    '/404',
    '/offline',
    '/favicon/favicon.ico',
    '/assets/images/core/fallback.png'
].concat ( serviceWorkerOption.assets );

self.addEventListener ( 'install', ( event ) => {
    const preCache = async () => {
        caches.open ( 'core' )
            .then ( ( cache ) => {
                return cache.addAll ( CORE_ASSETS );
            } );
    };
    event.waitUntil ( preCache ().then ( self.skipWaiting () )
    );
} );

self.addEventListener ( 'fetch', ( event ) => {
    if ( isCoreGetRequest ( event.request ) ) {
        event.respondWith (
            caches.open ( 'core' ).then ( ( cache ) => {
                console.log ( 'Core Asset request' );
                return cache.match ( event.request )
            } ).catch ( () => {
                return new Response ( 'CORE_ASSETS not found in cache' );
            } )
        )
    } else if ( isIconGetRequest ( event.request ) ) {
        event.respondWith ( checkCacheThenNet ( event, 'Icon request', 'icon', '/favicon/favicon.ico' ) );
    } else if ( isImgGetRequest ( event.request ) ) {
        event.respondWith ( alwaysNetThenFallback ( event, '/assets/images/core/fallback.png' ) );
    } else if ( isHtmlGetRequest ( event.request ) ) {
        event.respondWith ( alwaysNetThenFallback ( event, '/offline' ) );
    } else if ( isJsGetRequest ( event.request ) ) {
        event.respondWith ( checkCacheThenNet ( event, 'Script request', 'js', '/main.js' ) );
    } else if ( isCssGetRequest ( event.request ) ) {
        event.respondWith ( checkCacheThenNet ( event, 'Styles request', 'css', '/styles.css' ) );
    }
} );

/**
 *
 * @param event
 * @param log
 * @param cacheName
 * @param fallback
 */
function checkCacheThenNet ( event, log, cacheName, fallback ) {
    const hasQuery = event.request.url.indexOf ( '?' ) !== -1;
    return caches.match ( event.request, {
        ignoreSearch: hasQuery
    } ).then ( ( resp ) => {
        console.log ( log );
        if ( resp ) {
            return resp;
        } else {
            return fetch ( event.request.url, { redirect: 'follow' } )
                .then ( ( response ) => {
                    if ( response.ok ) {
                        console.log ( 'response OK' );
                        const responseClone = response.clone ();
                        return caches.open ( cacheName )
                            .then ( ( cache ) => {
                                cache.put ( event.request, responseClone );
                                return response;
                            } )
                            .catch ( err => {
                                console.error ( err );
                            } )
                            .finally ( () => response )
                    } else {
                        return caches.match ( fallback ).then ( res => {
                            return res
                        } );
                    }
                } )
                .catch ( err => {
                    console.error ( err );
                    return caches.match ( fallback ).then ( res => {
                        return res
                    } )
                } )
        }
    } )
        .catch ( err => {
            console.error ( err );
            return caches.match ( fallback ).then ( res => {
                console.log ( res );
                return res
            } );
        } )
}

/**
 *
 * @param event
 * @param fallback
 * @returns {Promise<Response>}
 */
function alwaysNetThenFallback ( event, fallback ) {
    return fetch ( event.request.url, { redirect: 'follow' } )
        .then ( ( response ) => {
            if ( response.ok ) {
                console.log ( 'response OK' );
                return response;
            } else {
                return caches.match ( fallback )
                    .then ( res => {
                        console.log ( res );
                        return res
                    } )
                    .catch ( err => {
                        console.error ( err );
                    } )
            }
        } )
        .catch ( err => {
            console.error ( err );
            return caches.match ( fallback ).then ( res => {
                console.log ( res );
                return res
            } )
        } )
}

/**
 *
 * @param request
 * @returns {boolean|boolean}
 */
function isHtmlGetRequest ( request ) {
    return request.method === 'GET' && ( request.headers.get ( 'accept' ) !== null && request.headers.get ( 'accept' ).indexOf ( 'text/html' ) > -1 );
}

/**
 *
 * @param request
 * @returns {boolean|boolean}
 */
function isJsGetRequest ( request ) {
    return request.method === 'GET' && ( request.headers.get ( 'accept' ) !== null && request.headers.get ( 'accept' ).indexOf ( 'application/javascript' ) > -1 );
}

/**
 *
 * @param request
 * @returns {boolean|boolean}
 */
function isCssGetRequest ( request ) {
    return request.method === 'GET' && ( request.headers.get ( 'accept' ) !== null && request.headers.get ( 'accept' ).indexOf ( 'text/css' ) > -1 );
}

function isImgGetRequest ( request ) {
    return request.method === 'GET' && ( request.headers.get ( 'accept' ) !== null && request.headers.get ( 'accept' ).indexOf ( 'image/*' ) > -1 );
}

/**
 *
 * @param request
 * @returns {boolean|boolean}
 */
function isCoreGetRequest ( request ) {
    return request.method === 'GET' && ( request.headers.get ( 'accept' ) !== null && CORE_ASSETS.includes ( getPathName ( request.url ) ) )
}

/**
 *
 * @param request
 * @returns {boolean|boolean}
 */
function isIconGetRequest ( request ) {
    return request.method === 'GET' && ( request.headers.get ( 'accept' ) !== null && getPathName ( request.url ).includes ( 'icon' ) );
}

/**
 *
 * @param requestUrl
 * @returns {string}
 */
function getPathName ( requestUrl ) {
    const url = new URL ( requestUrl );
    return url.pathname
}