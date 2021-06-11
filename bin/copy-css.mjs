#! /usr/bin/env node
'use strict';

import glob from 'glob';
import fs from 'fs';
import { dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = __dirname.split('node_modules')[0];
const assetsDirectory = rootDir + '/assets';

if (!fs.existsSync(assetsDirectory)) {
  fs.mkdirSync(assetsDirectory);
}

glob(rootDir + '/dist/collection/**/*.css', (err, files) => {
  if (err != null) {
    console.error(err);
    return;
  }

  files.forEach(file => {
    const filename = basename(file);
    fs.copyFile(file, assetsDirectory + '/' + filename, err => {
      if (err) console.error(err);
      else console.log('Copied ' + filename + ' to assets');
    });
  });
});
