import { teardown } from 'jest-dev-server';

export default async function globalTeardown() {
  await teardown(globalThis.servers);

  async function stop() {
    return new Promise((resolve) => {
      globalThis.browserstackLocalModule.stop(() => {
        resolve();
      });
    });
  }
  if (typeof process.env.LOCAL === 'undefined') {
    await stop();
  }
}
