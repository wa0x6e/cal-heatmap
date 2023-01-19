// @ts-ignore
import Runner from './Runner';

Runner('iOS 16 / Safari Latest', 'index-d3v7-umd.html', {
  'bstack:options': {
    deviceName: 'iPhone 14',
    osVersion: '16',
    browserVersion: 'latest',
  },
  browserName: 'safari',
});
