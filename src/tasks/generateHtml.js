const pug = require ( 'pug' );
const path = require ( 'path' );
const { getJson } = require ( "./generateData" );
const { writeToFile, checkFile } = require ( './generateData' );


function generateHtml ( writePath, templatePath, options ) {
    return new Promise ( ( resolve, reject ) => {
        getJson ( path.join ( __dirname, '../..', 'public/manifest.json' ) ).then ( revisions => {
            writeToFile ( writePath, pug.renderFile ( templatePath, { ...options, revisions: revisions } ), ( err ) => {
                if ( err ) return console.error ( err );
                checkFile ( writePath, 'html' ).then ( () => resolve () ).catch ( err => reject ( err ) )
            } );
        } );
    } )
}

module.exports = {
    generateHtml: generateHtml
};
