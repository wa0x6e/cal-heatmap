// @ts-ignore
import Runner from './Runner';

Runner(
  'Android / Chrome Latest',
  'index-d3v7-umd.html',
  {
    'bstack:options': {
      osVersion: '12.0',
      deviceName: 'Samsung Galaxy S21',
      browserVersion: 'latest',
    },
    browserName: 'chrome',
  },
);
