export {resolveFragments} from './resolveFragments';
import {DocumentDirectory} from '../ast';

export type DirectoryTransform = (dir: DocumentDirectory) => DocumentDirectory;

export function applyTransforms(dir: DocumentDirectory, ...transforms: DirectoryTransform[]): DocumentDirectory {
  let transformedDir = dir;
  transforms.forEach(transform => {
    transformedDir = transform(transformedDir);
  });
  return transformedDir;
}
