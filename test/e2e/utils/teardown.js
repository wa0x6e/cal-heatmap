import { teardown } from 'jest-dev-server';

export default async function globalTeardown() {
  await teardown();

  async function stop() {
    return new Promise((resolve) => {
      globalThis.browserstackLocalModule.stop(() => {
        resolve();
      });
    });
  }
  await stop();
}
