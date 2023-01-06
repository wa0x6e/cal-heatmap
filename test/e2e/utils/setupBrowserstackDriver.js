import { Builder } from 'selenium-webdriver';

globalThis.buildDriver = () => {
  const username = process.env.BROWSERSTACK_USERNAME;
  const accesskey = process.env.BROWSERSTACK_ACCESS_KEY;

  const capabilities = {
    'bstack:options': {
      projectName: 'Testing CalHeatmap and d3js on browsers matrix',
      local: true,
    },
  };

  return new Builder()
    .usingServer(
      `https://${username}:${accesskey}@hub-cloud.browserstack.com/wd/hub`,
    )
    .withCapabilities(capabilities)
    .forBrowser('chrome')
    .build();
};
