#! /usr/bin/env node
'use strict';

const glob = require('glob');
const path = require('path');
const fs = require('fs');

const guid = require('../dist/index.js').guid;
console.log(guid);

function create_css(data) {
  console.log(data);
}

function deduplicate_file(file) {
  fs.readFile(file, 'utf-8', function (err, data) {
    if (err) {
      console.error(err);
      return;
    }

    create_css(data);
  });
}

const rootDir = __dirname.split('node_modules')[0];
glob(rootDir + '/dist/esm/*.entry.js', (err, files) => {
  if (err != null) {
    console.error(err);
    return;
  }

  files.forEach(deduplicate_file);
});
