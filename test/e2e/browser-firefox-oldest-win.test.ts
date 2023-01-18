// @ts-ignore
import Runner from './Runner';

Runner(
  'Win11 / Firefox Latest',
  'index-d3v7-umd.html',
  {
    'bstack:options': {
      os: 'Windows',
      osVersion: '8',
      browserVersion: '107.0',
    },
    browserName: 'Firefox',
  },
);
