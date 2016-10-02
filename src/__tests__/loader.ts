import {
  Document,
  OperationDefinition,
  FragmentDefinition,
} from 'graphql';
import {assert} from 'chai';
import {loadDocument} from '../loader';

import path = require('path');

describe('GraphQL project loader', () => {
  describe('loadDocument', () => {
    it('should be able to load a query document', () => {
      return loadDocument(path.join(
        __dirname, '..', '..', 'example', 'queries', 'ListMovies.graphql'
      ))
      .then((doc: Document) => {
        assert.equal(doc.kind, 'Document');
        assert.equal(doc.definitions.length, 1);
        assert.equal(doc.definitions[0].kind, 'OperationDefinition');
        assert.equal(
          (doc.definitions[0] as OperationDefinition).name.value,
          'ListMovies'
        );
      });
    });

    it('should be able to load a fragment document', () => {
      return loadDocument(path.join(
        __dirname, '..', '..', 'example', 'fragments', 'onFilm', 'Movie.graphql'
      ))
      .then((doc: Document) => {
        assert.equal(doc.kind, 'Document');
        assert.equal(doc.definitions.length, 1);
        assert.equal(doc.definitions[0].kind, 'FragmentDefinition');
        assert.equal(
          (doc.definitions[0] as FragmentDefinition).name.value,
          'Movie'
        );
      });
    });
  });
});
