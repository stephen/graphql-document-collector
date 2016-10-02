import {assert} from 'chai';
import {loadGlob} from '../loader';
import {flattenDirectoryStructure} from '../flatten';
import {DocumentDirectory} from '../ast';

import path = require('path');

describe('Directory structure flattener', () => {
  it('should make docs accessible by path', () => {
    return loadGlob(
      path.join(__dirname, '..', '..', 'example'),
      '**/*.graphql'
    )
    .then(root => {
      const flattened = flattenDirectoryStructure(root);
      assert.deepEqual(Object.keys(flattened), [
        "fragments/onFilm/Movie.graphql",
        "fragments/onPlanet/Place.graphql",
        "queries/ListMovies.graphql",
      ]);
    });
  });
});
