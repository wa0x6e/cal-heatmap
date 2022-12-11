import { select } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';
// import quarterTemplate from '../fixtures/quarterTemplate';

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

  it.todo(
    'adds the given template',
    //   , () => {
    //   const date = new Date(2020, 3, 5, 3, 6);

    //   cal.addTemplates(quarterTemplate);
    //   cal.init({
    //     date: { start: date },
    //     domain: { type: 'year' },
    //     subDomain: { type: 'quarter' },
    //     formatter: { subDomainLabel: 'x' },
    //   });

    //   const s = selectAll('.graph-subdomain-group g text').nodes();

    //   expect(s.length).toBe(4);
    //   expect(+s[0].html()).toBe(+new Date(2020, 0, 1, 0, 0));
    //   expect(+s[1].html()).toBe(+new Date(2020, 3, 1, 0, 0));
    //   expect(+s[2].html()).toBe(+new Date(2020, 6, 1, 0, 0));
    //   expect(+s[3].html()).toBe(+new Date(2020, 9, 1, 0, 0));
    // }
  );
});
