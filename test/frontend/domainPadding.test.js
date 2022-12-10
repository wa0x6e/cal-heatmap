import { select } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('Domain padding', () => {
  let cal = null;
  beforeEach(() => {
    cal = new CalHeatmap();
    select('body').append('div').attr('id', 'cal-heatmap');
  });

  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('adds padding to the top', () => {
    cal.init({
      range: 1,
      domain: { padding: [10, 0, 0, 0] },
      subDomain: { gutter: 0, width: 10, height: 10 },
    });

    expect(select('.graph-subdomain-group').attr('y')).toBe('10');
    expect(select('.graph-subdomain-group').attr('x')).toBe('0');
    expect(select('.graph-domain').attr('y')).toBe('0');
    expect(select('.graph-domain').attr('x')).toBe('0');
    expect(select('.graph-domain').attr('width')).toBe('60');
    // padding:10 + subDomains:100 + label:25
    expect(select('.graph-domain').attr('height')).toBe('135');
  });
  it('adds padding to the right', () => {
    cal.init({
      range: 1,
      domain: { padding: [0, 10, 0, 0] },
      subDomain: { gutter: 0, width: 10, height: 10 },
    });

    expect(select('.graph-subdomain-group').attr('y')).toBe('0');
    expect(select('.graph-subdomain-group').attr('x')).toBe('0');
    expect(select('.graph-domain').attr('y')).toBe('0');
    expect(select('.graph-domain').attr('x')).toBe('0');
    expect(select('.graph-domain').attr('width')).toBe('70');
    expect(select('.graph-domain').attr('height')).toBe('125');
  });
  it('adds padding to the bottom', () => {
    cal.init({
      range: 1,
      domain: { padding: [0, 0, 10, 0] },
      subDomain: { gutter: 0, width: 10, height: 10 },
    });

    expect(select('.graph-subdomain-group').attr('y')).toBe('0');
    expect(select('.graph-subdomain-group').attr('x')).toBe('0');
    expect(select('.graph-domain').attr('y')).toBe('0');
    expect(select('.graph-domain').attr('x')).toBe('0');
    expect(select('.graph-domain').attr('width')).toBe('60');
    expect(select('.graph-label').attr('y')).toBe(`${100 + 25 / 2}`);
    // padding:10 + subDomains:100 + label:25
    expect(select('.graph-domain').attr('height')).toBe('135');
  });
  it('adds padding to the left', () => {
    cal.init({
      range: 1,
      domain: { padding: [0, 0, 0, 10] },
      subDomain: { gutter: 0, width: 10, height: 10 },
    });

    expect(select('.graph-subdomain-group').attr('y')).toBe('0');
    expect(select('.graph-subdomain-group').attr('x')).toBe('10');
    expect(select('.graph-domain').attr('y')).toBe('0');
    expect(select('.graph-domain').attr('x')).toBe('0');
    expect(select('.graph-domain').attr('width')).toBe('70');
    // subDomains:100 + label:25
    expect(select('.graph-domain').attr('height')).toBe('125');
  });
});
