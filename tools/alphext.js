#!/usr/bin/env node
// Extracts Alpha from PNG images, inverts it,
// then saves the image as a name that is suitable
// to import into a font editor (i.e FontForge)
// for later vectorization.

var async = require('async')
  , util = require('util')
  , printf = require('printf')

  , fs = require('fs')
  , path = require('path')

  , PNG = require('png-js')
  , png = require('png')

// CONSTANTS //////////////////////////////////////////////////////////////////
var startcode = 0xF000
  , pattern = /^glyphicons_(\d+)_(.+)\.png$/
  , outfmt = 'uni%04X.png'
  , invert = true
pattern.map = {id: 1, name: 2}

// Extract arguments
var src = process.argv[2]
  , dst = process.argv[3]
//FIXME: use commander

// PROCESS ////////////////////////////////////////////////////////////////////
fs.readdir(src, function (err, files) {
  if (err) return console.error('Failed reading source directory:', err)
  return async.forEachSeries(files, processFile, function (err) {
    if (err) return console.error('Error occured:', err)
    console.log('Everything completed successfully, YEAH!')
  })
})

function processFile(file, next) {
  var match = file.match(pattern)
  if (!match) return next({reason: "Invalid file found!", file: file})
  var id = parseInt(match[pattern.map.id], 10)
  if (id===NaN) return next({reason: "Invalid file name, no ID!", file: file})

  var ifile = path.join(src, file)
    , ofile = path.join(dst, printf(outfmt, startcode+id))

  return fs.readFile(ifile, function (err, idata) {
    if (err) return next(err)
    var ipng = new PNG(idata)
      , area = ipng.width * ipng.height
    return ipng.decode(function (ipix) {
      var opix = new Buffer(area * 3)
      for (i=3, e=0; i<ipix.length; i+=4, e++) {
        var value = invert? (255 - ipix[i]) : ipix[i]
        for (o=0; o<3; o++) opix.writeUInt8(value, e*3+o)
      }

      var opng = new png.Png(opix, ipng.width, ipng.height)
      return opng.encode(function (odata) {
        fs.writeFile(ofile, odata, function (err) {
          console.log('processed: %s', ifile)
          return next(err)
        })
      })
    })
  })
}
