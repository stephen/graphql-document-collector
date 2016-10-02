export function promisify(
  originalFunction: Function
): (...args: Array<any>) => Promise<any> {
  return function promisified(...args: Array<any>) {
    return new Promise(function promiseExec(resolve: Function, reject: Function) {
      originalFunction(...args, (err: Error, res: any) => {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
    });
  };
}
