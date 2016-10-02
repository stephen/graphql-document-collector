import {assert} from 'chai';
import {
  loadGlob,
  loadDocument,
} from '../../loader';
import {createFragmentMap} from '../resolveFragments';

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
        ))
      ])
      .then(([root, movieFragDoc]: any[]) => {
        const fMap = createFragmentMap(root);
        assert.deepEqual(fMap['Movie'], movieFragDoc.definitions[0]);
      });
    });
  });
});
