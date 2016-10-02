import {
  DirectoryTransform,
  applyTransforms,
  resolveFragments,
} from './transforms';
import {
  DocumentFlatMap,
  flattenDirectoryStructure,
} from './flatten';
import {
  loadGlob,
} from './loader';

export * from './transforms';
export * from './ast';
export * from './flatten';
export * from './loader';

export default function loadTransformAndFlatten(
  basePath: string,
  globPath: string,
  transforms: DirectoryTransform[] = [resolveFragments]
): Promise<DocumentFlatMap> {
  return loadGlob(basePath, globPath)
  .then(root =>
    flattenDirectoryStructure(applyTransforms(root, ...transforms))
  );
}
