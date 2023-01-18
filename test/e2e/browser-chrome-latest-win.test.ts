// @ts-ignore
import Runner from './Runner';

Runner(
  'Win11 / Chrome Latest',
  'index-d3v7-umd.html',
  {
    'bstack:options': {
      os: 'Windows',
      osVersion: '11',
      browserVersion: 'latest',
    },
    browserName: 'Chrome',
  },
);
