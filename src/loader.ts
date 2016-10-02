import {Document} from 'graphql';
import {parse} from 'graphql-tag/parser';
import {promisify} from './promisify';

import fs = require('fs');
import cbGlob = require('glob');

const readFile = promisify(fs.readFile);
const glob = promisify(cbGlob);

export function loadDocument(path: string): Promise<Document> {
  return readFile(path)
  .then((fileBuffer: Buffer) => parse(fileBuffer.toString()));
}
