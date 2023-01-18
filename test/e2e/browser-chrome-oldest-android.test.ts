// @ts-ignore
import Runner from './Runner';

Runner(
  'Android / Chrome Latest',
  'index-d3v7-umd.html',
  {
    'bstack:options': {
      osVersion: '5.0',
      deviceName: 'Samsung Galaxy S6',
      browserVersion: 'latest',
    },
    browserName: 'chrome',
  },
);
