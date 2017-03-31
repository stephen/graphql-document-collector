import {
  Document,
} from 'graphql';
import {parse} from 'graphql-tag/parser';
import {promisify} from './util/promisify';
import {DocumentDirectory} from './ast';
import * as babylon from 'babylon';

import fs = require('fs');
import path = require('path');
import cbGlob = require('glob');

const readFile = promisify(fs.readFile);
const glob = promisify(cbGlob);

export function loadDocument(pt: string): Promise<Document> {
  const splitPath = pt.split(path.sep);
  return readFile(pt)
  .then((fileBuffer: Buffer) => {
    const content = fileBuffer.toString();
    if (pt.endsWith('graphql')) {
      return [parse(content)];
    } else {
      const ast = babylon.parse(content, { sourceType: 'module', plugins: ['jsx']});
      const tagged: any[] = [];

      traverse(ast.program.body, (node) => {
        if (node.type === 'TaggedTemplateExpression' && node.tag.name === 'gql') {
          tagged.push(node.quasi.quasis[0].value.raw);
        }
      });

      return tagged.map(content => parse(content));
    }
  })
  .then((documents: any) =>
    documents.map((doc: any) =>
      Object.assign(
        {},
        doc,
        {name: {kind: 'Name', value: splitPath[splitPath.length - 1]}},
      )
    )
  );
}

const TRAVERSAL_BLACKLIST = new Set(['parent', 'trailingComments', 'leadingComments']);
function traverse(node: any, visitor: (node: any) => void) {
  visitor(node);

  const keys = Object.keys(node)
    .filter((key) => !TRAVERSAL_BLACKLIST.has(key) && node[key] && node[key] instanceof Object)
    .forEach((key) => {
      traverse(node[key], visitor);
    });
}

function flatten(arr: any[]): any[] {
  return arr.reduce(
    (acc: any[], val: any) => acc.concat(Array.isArray(val) ? flatten(val) : val),
    [],
  );
}

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
  .then(([documents, directories]: [any[], any[]]) => {
    const flattenedDocuments: Document[] = flatten(documents);
    return {
      kind: 'DocumentDirectory',
      name: {
        kind: 'Name',
        value: basePath[basePath.length - 1],
      },
      documents: flattenedDocuments,
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
