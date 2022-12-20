import { select, selectAll } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';
import quarterTemplate from '../fixtures/quarterTemplate';

describe('SubDomainTemplate', () => {
  let cal: CalHeatmap;

  beforeEach(() => {
    select('body').append('div').attr('id', 'cal-heatmap');
    cal = new CalHeatmap();
  });

  afterEach(() => {
    cal.destroy();
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('adds the given template', () => {
    const date = new Date(2020, 3, 5, 3, 6);

    cal.addTemplates(quarterTemplate);
    cal.paint({
      range: 1,
      date: { start: date },
      domain: { type: 'year' },
      subDomain: { type: 'quarter', label: 'Q' },
    });

    const s = selectAll('.graph-subdomain-group g text').nodes();

    expect(s.length).toBe(4);
    expect(select(s[0]).html()).toBe('1');
    expect(select(s[1]).html()).toBe('2');
    expect(select(s[2]).html()).toBe('3');
    expect(select(s[3]).html()).toBe('4');
  });
});
