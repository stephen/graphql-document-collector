import {DocumentNode} from 'graphql';
import {DocumentDirectory} from './ast';

export interface DocumentFlatMap {
  [docPath: string]: DocumentNode;
}

export function flattenDirectoryStructure(
  dir: DocumentDirectory, flatMap: DocumentFlatMap = {}, cwd: string[] = []
): DocumentFlatMap {
  dir.documents.forEach(doc => {
    flatMap[[...cwd, (doc as any).name.value].join('/')] = doc;
  });
  dir.directories.forEach(dir => {
    flattenDirectoryStructure(dir, flatMap, [...cwd, dir.name.value])
  });
  return flatMap;
}
