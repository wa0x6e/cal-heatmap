// @ts-ignore
import Runner from './Runner';

Runner(
  'Win11 / Chrome Latest',
  'https://cal-heatmap.com/tests/index-d3v7-umd.html',
  {
    'bstack:options': {
      os: 'Windows',
      osVersion: '11',
      browserVersion: 'latest',
    },
    browserName: 'Chrome',
  },
);
