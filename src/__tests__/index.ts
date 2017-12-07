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
      // graphql-js adds extra properties to the AST nodes that do not
      // not show up when toJSON is called.
      assert.deepEqual(JSON.parse(JSON.stringify(docMap)), documentsJson);
    });
  });
});
