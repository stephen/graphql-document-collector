import loadTransformAndFlatten from '../index';
import {assert} from 'chai';

import path = require('path');

const documentsJson = require('../../example/documents.json');

describe('Load, Transform and Flatten', () => {
  it('should load documents in a structured object', () => {
    return loadTransformAndFlatten(
      path.join(__dirname, '..', '..', 'example'),
      '**/*.graphql'
    )
    .then(docMap => {
      assert.deepEqual(docMap, documentsJson);
    });
  });
});
