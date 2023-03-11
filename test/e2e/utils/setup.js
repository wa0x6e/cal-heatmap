import { setup } from 'jest-dev-server';
import { Local } from 'browserstack-local';

export default async function globalSetup() {
  globalThis.servers = await setup({
    command: 'node test/e2e/utils/server.js',
    launchTimeout: 10000,
    usedPortAction: 'kill',
  });

  async function start() {
    globalThis.browserstackLocalModule = new Local();

    return new Promise((resolve, reject) => {
      globalThis.browserstackLocalModule.start(
        {
          key: process.env.BROWSERSTACK_ACCESS_KEY,
          force: true,
          onlyAutomate: true,
        },
        (error) => {
          if (error) {
            reject(error);
          }
          resolve();
        },
      );
    });
  }
  if (typeof process.env.LOCAL === 'undefined') {
    await start();
  }
}
