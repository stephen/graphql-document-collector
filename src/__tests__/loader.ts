import {
  DocumentNode,
  OperationDefinitionNode,
  FragmentDefinitionNode,
} from 'graphql';
import {assert} from 'chai';
import {
  loadDocument,
  loadGlob,
} from '../loader';
import {
  DocumentDirectory,
} from '../ast';

import path = require('path');

describe('GraphQL project loader', () => {
  describe('loadDocument', () => {
    it('should be able to load a query document', () => {
      return loadDocument(path.join(
        __dirname, '..', '..', 'example', 'queries', 'ListMovies.graphql'
      ))
      .then((doc: DocumentNode) => {
        assert.equal(doc.kind, 'Document');
        assert.equal((doc as any).name.value, 'ListMovies.graphql');
        assert.equal(doc.definitions.length, 1);
        assert.equal(doc.definitions[0].kind, 'OperationDefinition');
        assert.equal(
          (doc.definitions[0] as OperationDefinitionNode).name.value,
          'ListMovies'
        );
      });
    });

    it('should be able to load a fragment document', () => {
      return loadDocument(path.join(
        __dirname, '..', '..', 'example', 'fragments', 'onFilm', 'Movie.graphql'
      ))
      .then((doc: DocumentNode) => {
        assert.equal(doc.kind, 'Document');
        assert.equal((doc as any).name.value, 'Movie.graphql');
        assert.equal(doc.definitions.length, 1);
        assert.equal(doc.definitions[0].kind, 'FragmentDefinition');
        assert.equal(
          (doc.definitions[0] as FragmentDefinitionNode).name.value,
          'Movie'
        );
      });
    });
  });

  describe('loadGlob', () => {
    it('should load the whole structure of documents in an extended AST', () => {
      return Promise.all([
        loadGlob(
          path.join(__dirname, '..', '..', 'example'),
          '**/*.graphql'
        ),
        loadDocument(path.join(
          __dirname, '..', '..', 'example', 'queries', 'ListMovies.graphql'
        )),
        loadDocument(path.join(
          __dirname, '..', '..', 'example', 'fragments', 'onFilm', 'Movie.graphql'
        )),
      ])
      .then(([root, queryDoc, fragmentDoc]: any[]) => {
        assert.equal(root.kind, 'DocumentDirectory');
        assert.equal(root.name.value, 'example');
        assert.equal(root.directories[0].name.value, 'fragments');
        assert.equal(root.directories[0].directories[0].name.value, 'onFilm');
        assert.deepEqual(
          root.directories[0].directories[0].documents[0],
          fragmentDoc
        );
        assert.equal(root.directories[1].name.value, 'queries');
        assert.deepEqual(
          root.directories[1].documents[0],
          queryDoc
        );
      });
    });
  });
});
