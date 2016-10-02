import {
  Document,
  Name,
} from 'graphql';
import {parse} from 'graphql-tag/parser';
import {promisify} from './promisify';

import fs = require('fs');
import path = require('path');
import cbGlob = require('glob');

const readFile = promisify(fs.readFile);
const glob = promisify(cbGlob);

export function loadDocument(path: string): Promise<Document> {
  return readFile(path)
  .then((fileBuffer: Buffer) => parse(fileBuffer.toString()));
}

export interface DocumentDirectory {
  kind: 'DocumentDirectory';
  name: Name,
  documents: Document[];
  directories: DocumentDirectory[];
};

function loadDirectory(basePath: string[], paths: string[][]): Promise<DocumentDirectory> {
  const documentFileNames = paths.filter(pt => pt.length === 1).map(pt => pt[0]);
  const pathsInDirs = paths.filter(pt => pt.length > 1);
  const uniqueDirs = Array.from(new Set(pathsInDirs.map(pt => pt[0])));
  return Promise.all([
    Promise.all(documentFileNames.map(fileName =>
      loadDocument(path.join(basePath.join(path.sep), fileName))
    )),
    Promise.all(uniqueDirs.map((dirName: string) => {
      const pathsInDir = pathsInDirs
      .filter((pt: string[]) => pt[0] === dirName)
      .map((pt: string[]) => pt.slice(1));
      return loadDirectory([...basePath, dirName], pathsInDir);
    })),
  ])
  .then(([documents, directories]: any[]) => {
    return {
      kind: 'DocumentDirectory',
      name: {
        kind: 'Name',
        value: basePath[basePath.length - 1],
      },
      documents,
      directories,
    };
  });
}

export function loadGlob(
  basePath: string, globPath: string
): Promise<DocumentDirectory> {
  let rootDirectory = {};
  return glob(path.join(basePath, globPath))
  .then((paths: string[]) =>
    paths.map((pt: string) => pt.slice(basePath.length + 1).split(path.sep))
  )
  .then((paths: string[][]) => loadDirectory(basePath.split(path.sep), paths));
}
