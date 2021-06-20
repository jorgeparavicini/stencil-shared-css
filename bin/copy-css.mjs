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
const componentDir = rootDir + '/dist/esm/';

function readCss(fileContent) {
  // Matches everything after the string 'Css = "'
  // and captures everything up to the closing quote
  const re = /Css\s+=\s+\"([^\"]*)/;
  const matches = re.exec(fileContent);
  if (matches == null || matches.length < 2) return null;

  return matches[1];
}

function removeCssConstant(fileContent) {
  const removeRegex = /[\n\r].*Css\s+=\s+\"([^\n\r]*)/;
  return fileContent.replace(removeRegex, '');
}

function writeCss(css) {
  const filename = `${uuid4()}.css`;
  fs.writeFileSync(assetsDirectory + filename, css);
  return filename;
}

function replaceStyleProperty(fileContent, newCssFilename) {
  const newProperty = `.__cssFilename = "${newCssFilename}"`;
  return fileContent.replace(/\.style\s*=\s*([^\n\r]*)/, newProperty);
}

if (!fs.existsSync(assetsDirectory)) {
  fs.mkdirSync(assetsDirectory);
}

glob(componentDir + '*.entry.js', (err, files) => {
  if (err != null) {
    console.error(err);
    return;
  }

  files.forEach(file => {
    let fileContent = fs.readFileSync(file).toString('utf-8');
    const css = readCss(fileContent);
    if (css == null) return;

    fileContent = removeCssConstant(fileContent);
    const filename = writeCss(css);
    fileContent = replaceStyleProperty(fileContent, filename);
    fs.writeFileSync(file, fileContent);
  });
});
