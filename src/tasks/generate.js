const path = require ( 'path' );
const { generateHtml } = require ( './generateHtml' );
require ( 'dotenv' ).config ();

const siteTitle = 'Static Site Boilerplate';

generateCommon ();

function generateCommon () {
    generateFallbacks ();
    console.log ( '🚀 Generated 404 and offline fallback' );
    generateIndex ( );
    console.log ( '🚀 Generated index' );
}

function generateIndex () {
    generateHtml ( path.join ( __dirname, '../..', 'public/index.html' ),
        path.join ( __dirname, '..', 'Pages/home.pug' ),
        {
            title: siteTitle,
            pageTitle: "Home",
        } );
}

function generateFallbacks () {
    generateHtml ( path.join ( __dirname, '../..', 'public/404/index.html' ),
        path.join ( __dirname, '..', 'Pages/404.pug' ),
        {
            title: siteTitle,
            pageTitle: "404",
        } );
    generateHtml ( path.join ( __dirname, '../..', 'public/offline/index.html' ),
        path.join ( __dirname, '..', 'Pages/offline.pug' ),
        {
            title: siteTitle,
            pageTitle: "Offline",
        } );
}