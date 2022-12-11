import { select, selectAll } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';
import quarterTemplate from '../fixtures/quarterTemplate';

describe('SubDomainTemplate', () => {
  let cal = new CalHeatmap();

  beforeEach(() => {
    select('body').append('div').attr('id', 'cal-heatmap');
    cal = new CalHeatmap();
  });

  afterEach(() => {
    cal.destroy();
    cal = null;
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('adds the given template', () => {
    const date = new Date(2020, 3, 5, 3, 6);

    cal.addTemplates(quarterTemplate);
    cal.init({
      range: 1,
      date: { start: date },
      domain: { type: 'year' },
      subDomain: { type: 'quarter', label: 'x' },
    });

    const s = selectAll('.graph-subdomain-group g text').nodes();

    expect(s.length).toBe(4);
    // eslint-disable-next-line no-underscore-dangle
    expect(s[0].__data__.t).toBe(+new Date(2020, 0, 1, 0, 0));
    // eslint-disable-next-line no-underscore-dangle
    expect(s[1].__data__.t).toBe(+new Date(2020, 3, 1, 0, 0));
    // eslint-disable-next-line no-underscore-dangle
    expect(s[2].__data__.t).toBe(+new Date(2020, 6, 1, 0, 0));
    // eslint-disable-next-line no-underscore-dangle
    expect(s[3].__data__.t).toBe(+new Date(2020, 9, 1, 0, 0));
  });
});
