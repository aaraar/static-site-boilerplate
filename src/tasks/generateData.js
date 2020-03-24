const path = require ( 'path' );
const fs = require ( 'fs-extra' );
require ( 'dotenv' ).config ();

function writeToFile ( writePath, data, cb ) {
    fs.mkdirp ( path.dirname ( writePath ), err => {
        if ( err ) console.error ( err );
        fs.writeFile ( writePath, data, { flag: 'w' }, cb )
    } );
}

function checkFile ( writePath ) {
    return new Promise ( ( resolve, reject ) => {
        fs.readFile ( writePath, 'utf-8', ( err, data ) => {
            if ( err ) reject ( err );
            resolve ( data );
        } );
    } )
}

function generateJson ( writePath, dataPromise ) {
    return new Promise ( ( resolve, reject ) => {
        dataPromise ().then ( ( json ) => {
            writeToFile ( writePath, JSON.stringify ( json ), ( err ) => {
                if ( err ) return console.error ( err );
                checkFile ( writePath ).then ( () => resolve () ).catch ( err => reject ( err ) )
            } );
        } );
    } )
}


function getJson ( writePath ) {
    return new Promise ( ( resolve, reject ) => {
        fs.readFile ( writePath, 'utf8', ( err, data ) => {
            if ( err ) reject ( err );
            resolve ( JSON.parse ( data ) );
        } )
    } )
}


module.exports = {
    generateJson: generateJson,
    getJson: getJson,
    writeToFile: writeToFile,
    checkFile: checkFile,
};