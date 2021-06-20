#! /usr/bin/env node
'use strict';

import glob from 'glob';
import fs from 'fs';
import { dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuid4 } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = __dirname.split('node_modules')[0];
const assetsDirectory = rootDir + '/assets/';

function readCss(fileContent) {
  // Matches everything after the string 'Css = "'
  // and captures everything up to the closing quote
  const re = /Css\s+=\s+\"([^\"]*)/;
  const matches = re.exec(fileContent);
  if (matches == null || matches.length < 2) return null;

  return matches[1];
}

function writeCss(css, result) {
  const filename = `${uuid4()}.css`;
  fs.writeFile(assetsDirectory + filename, css, err => {
    if (err) {
      console.error(err);
    }
    result(filename);
  });
}

if (!fs.existsSync(assetsDirectory)) {
  fs.mkdirSync(assetsDirectory);
}

glob(rootDir + '/dist/esm/*.entry.js', (err, files) => {
  if (err != null) {
    console.error(err);
    return;
  }

  files.forEach(file => {
    const css = readCss(fs.readFileSync(file));
    console.log(css);
    if (css == null) return;

    writeCss(css, filename => {
      console.log(filename);
    })
  });
});