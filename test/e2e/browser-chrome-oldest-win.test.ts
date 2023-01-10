// @ts-ignore
import Runner from './Runner';

Runner(
  'Win8 / Chrome Latest',
  'https://cal-heatmap.com/tests/index-d3v7-umd.html',
  {
    'bstack:options': {
      os: 'Windows',
      osVersion: '8',
      browserVersion: '103.0',
    },
    browserName: 'Chrome',
  },
);
