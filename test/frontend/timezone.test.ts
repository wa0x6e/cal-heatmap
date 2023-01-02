import { select } from 'd3-selection';
import moment from 'moment-timezone';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';
import Timezone from '../../src/plugins/Timezone';

describe('Timezone plugin', () => {
  let cal: CalHeatmap;
  beforeEach(() => {
    window.moment = moment;
    cal = new CalHeatmap();
    select('body').append('div').attr('id', 'cal-heatmap');
  });

  afterEach(() => {
    cal.destroy();
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('uses the local timezone without the plugin', () => {
    const startDate = new Date(2020, 0, 1);

    cal.paint({
      domain: { type: 'month' },
      subDomain: { type: 'day', label: (t) => `${new Date(t).toISOString()}` },
      date: { start: startDate },
    });

    expect(select('.graph-subdomain-group g:nth-child(1) text').html()).toBe(
      startDate.toISOString(),
    );
  });

  it('uses the local timezone with the plugin without timezone set', () => {
    const startDate = new Date(2020, 0, 1);

    cal.paint(
      {
        domain: { type: 'month' },
        subDomain: {
          type: 'day',
          label: (t) => `${new Date(t).toISOString()}`,
        },
        date: { start: startDate },
      },
      [[Timezone]],
    );

    expect(select('.graph-subdomain-group g:nth-child(1) text').html()).toBe(
      startDate.toISOString(),
    );
  });

  it('uses the given timezone and the same date timezone', () => {
    const startDate = new Date('2020-01-01T00:00:00.000+09:00');

    cal.paint(
      {
        domain: { type: 'month' },
        subDomain: {
          type: 'day',
          label: (t) => `${new Date(t).toISOString()}`,
        },
        date: { start: startDate },
      },
      [[Timezone, { timezone: 'Asia/Tokyo' }]],
    );

    expect(select('.graph-subdomain-group g:nth-child(1) text').html()).toBe(
      startDate.toISOString(),
    );
  });

  it('uses the given timezone with a different date timezone', () => {
    const startDate = new Date('2020-01-01T00:00:00.000+04:00');

    cal.paint(
      {
        domain: { type: 'month' },
        subDomain: {
          type: 'day',
          label: (t) => `${new Date(t).toISOString()}`,
        },
        date: { start: startDate },
      },
      [[Timezone, { timezone: 'Europe/Paris' }]],
    );

    expect(select('.graph-subdomain-group g:nth-child(1) text').html()).toBe(
      '2019-11-30T23:00:00.000Z',
    );
  });

  it('uses the given timezone with a different date timezone 2', () => {
    const startDate = new Date('2020-01-01T00:00:00.000-04:00');

    cal.paint(
      {
        domain: { type: 'month' },
        subDomain: {
          type: 'day',
          label: (t) => `${new Date(t).toISOString()}`,
        },
        date: { start: startDate },
      },
      [[Timezone, { timezone: 'utc' }]],
    );

    expect(select('.graph-subdomain-group g:nth-child(1) text').html()).toBe(
      '2020-01-01T00:00:00.000Z',
    );
  });
});
