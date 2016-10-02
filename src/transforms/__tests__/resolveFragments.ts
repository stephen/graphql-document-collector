import {assert} from 'chai';
import {
  loadGlob,
  loadDocument,
} from '../../loader';
import {
  createFragmentMap,
  addFragmentsToDocument,
} from '../resolveFragments';

import path = require('path');

describe('Resolve fragments transformer', () => {
  describe('createFragmentMap', () => {
    it('should map fragments in a plain JS object', () => {
      return Promise.all([
        loadGlob(
          path.join(__dirname, '..', '..', '..', 'example'),
          '**/*.graphql'
        ),
        loadDocument(path.join(
          __dirname, '..', '..', '..', 'example', 'fragments', 'onFilm', 'Movie.graphql'
        )),
      ])
      .then(([root, movieFragDoc]: any[]) => {
        const fMap = createFragmentMap(root);
        assert.deepEqual(fMap['Movie'], movieFragDoc.definitions[0]);
      });
    });
  });

  describe('addFragmentsToDocument', () => {
    it('should resolve all nested fragments', () => {
      return Promise.all([
        loadGlob(
          path.join(__dirname, '..', '..', '..', 'example'),
          '**/*.graphql'
        ),
        loadDocument(path.join(
          __dirname, '..', '..', '..', 'example', 'fragments', 'onFilm', 'Movie.graphql'
        )),
        loadDocument(path.join(
          __dirname, '..', '..', '..', 'example', 'fragments', 'onPlanet', 'Place.graphql'
        )),
      ])
      .then(([root, movieFragDoc, placeFragDoc]: any[]) => {
        const fMap = createFragmentMap(root);
        const origDoc = root.directories[1].documents[0];
        const transformedDoc = addFragmentsToDocument(origDoc, fMap);
        assert.equal(transformedDoc.definitions.length, 3);
      });
    });
  });
});
