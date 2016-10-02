import {
  Document,
  FragmentDefinition,
  OperationDefinition,
  SelectionSet,
  FragmentSpread,
  Field,
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

function fragmentSpreadsInSelectionSet(
  selSet: SelectionSet, fMap: FragmentMap, fragmentSpreads: Set<string>
): Set<string> {
  // TODO: make this function pure
  selSet.selections.forEach(sel => {
    if (sel.kind === 'FragmentSpread') {
      const fragmentName = (sel as FragmentSpread).name.value;
      fragmentSpreads.add(fragmentName);
      fragmentSpreadsInSelectionSet(fMap[fragmentName].selectionSet, fMap, fragmentSpreads);
    } else if (sel.kind === 'Field' && (sel as Field).selectionSet) {
      fragmentSpreadsInSelectionSet((sel as Field).selectionSet, fMap, fragmentSpreads);
    }
  });
  return fragmentSpreads;
}

export function addFragmentsToDocument(document: Document, fMap: FragmentMap): Document {
  // TODO: make this function pure
  let fragmentSpreads: Set<string> = new Set()
  document.definitions.forEach(def => {
    if (def.kind === 'OperationDefinition' || def.kind === 'FragmentDefinition') {
      const selSetDef = (def as OperationDefinition|FragmentDefinition);
      fragmentSpreadsInSelectionSet(selSetDef.selectionSet, fMap, fragmentSpreads)
    }
  });
  return Object.assign({}, document, {
    definitions: [
      ...document.definitions,
      ...Array.from(fragmentSpreads).map(sp => fMap[sp]),
    ],
  });
}



export function resolveFragments(
  dir: DocumentDirectory,
  fMap: FragmentMap = null
): DocumentDirectory {
  if (!fMap) {
    fMap = createFragmentMap(dir);
  }

  return Object.assign({}, dir, {
    directories: dir.directories.map(subDir =>
      resolveFragments(subDir, fMap)
    ),
    documents: dir.documents.map(doc =>
      addFragmentsToDocument(doc, fMap)
    ),
  });
}
