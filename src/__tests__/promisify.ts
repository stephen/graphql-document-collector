import {assert} from 'chai';
import {promisify} from '../promisify';

describe('Promisification utility', () => {
  const simpleFunc = (cb: Function) => {
    cb(null, 'done');
  };
  const erroringFunc = (cb: Function) => {
    cb(new Error('errored'));
  };
  const multiArgsFunc = (a: number, b: number, cb: Function) => {
    cb(null, a + b);
  };

  it('should handle simple callbacks', (done) => {
    promisify(simpleFunc)()
    .then((res: string) => {
      assert.equal(res, 'done');
      done();
    });
  });

  it('should handle erroring callbacks', (done) => {
    promisify(erroringFunc)()
    .catch((err: Error) => {
      assert.equal(err.message, 'errored');
      done();
    });
  });

  it('should handle callbacks from multi args functions', (done) => {
    promisify(multiArgsFunc)(1, 2)
    .then((res: number) => {
      assert.equal(res, 3);
      done();
    });
  });
});
