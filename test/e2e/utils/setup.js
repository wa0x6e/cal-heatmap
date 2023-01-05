import { setup } from 'jest-dev-server';

export default async function globalSetup() {
  await setup({
    command: 'node test/e2e/utils/server.js',
    launchTimeout: 10000,
  });
}
