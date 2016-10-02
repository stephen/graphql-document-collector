import {
  FragmentDefinition,
} from 'graphql';
import {DocumentDirectory} from '../ast';

export interface FragmentMap {
  [fragmentName: string]: FragmentDefinition;
}

export function createFragmentMap(
  dir: DocumentDirectory, fragmentMap: FragmentMap = {}
): FragmentMap {
  // TODO: make this function pure
  dir.documents.forEach(doc => doc.definitions.forEach(def => {
    if (def.kind === 'FragmentDefinition') {
      const fragDef = (def as FragmentDefinition);
      fragmentMap[fragDef.name.value] = fragDef;
    }
  }));
  dir.directories.forEach(subDir => createFragmentMap(subDir, fragmentMap));
  return fragmentMap;
}

export function resolveFragmentsInOperations(
  root: DocumentDirectory
): DocumentDirectory {
  return root;
}
