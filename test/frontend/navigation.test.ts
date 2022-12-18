import { select, selectAll } from 'd3-selection';

/**
 * @jest-environment jsdom
 */

import CalHeatmap from '../../src/CalHeatmap';

describe('navigation', () => {
  let cal: CalHeatmap;
  beforeEach(() => {
    cal = new CalHeatmap();
    select('body').append('div').attr('id', 'cal-heatmap');
    cal.init({
      range: 2,
      domain: { type: 'year' },
      subDomain: { type: 'month' },
      date: { start: new Date(2020, 0, 1) },
    });
  });

  afterEach(() => {
    cal.destroy();
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('scrolls back by one steps', async () => {
    expect(select('.graph-domain:nth-child(1)').attr('class')).toContain(
      'y_2020',
    );
    expect(select('.graph-domain:nth-child(2)').attr('class')).toContain(
      'y_2021',
    );
    expect(selectAll('.graph-domain').nodes().length).toBe(2);

    await cal.previous();
    expect(select('.graph-domain:nth-child(1)').attr('class')).toContain(
      'y_2019',
    );
    expect(select('.graph-domain:nth-child(2)').attr('class')).toContain(
      'y_2020',
    );
  });

  it('scrolls back by n steps', async () => {
    expect(select('.graph-domain:nth-child(1)').attr('class')).toContain(
      'y_2020',
    );
    expect(select('.graph-domain:nth-child(2)').attr('class')).toContain(
      'y_2021',
    );
    expect(selectAll('.graph-domain').nodes().length).toBe(2);

    await cal.previous(5);
    expect(select('.graph-domain:nth-child(1)').attr('class')).toContain(
      'y_2015',
    );
    expect(select('.graph-domain:nth-child(2)').attr('class')).toContain(
      'y_2016',
    );
  });

  it('scrolls forward by one steps', async () => {
    expect(select('.graph-domain:nth-child(1)').attr('class')).toContain(
      'y_2020',
    );
    expect(select('.graph-domain:nth-child(2)').attr('class')).toContain(
      'y_2021',
    );
    expect(selectAll('.graph-domain').nodes().length).toBe(2);

    await cal.next();

    expect(select('.graph-domain:nth-child(1)').attr('class')).toContain(
      'y_2021',
    );
    expect(select('.graph-domain:nth-child(2)').attr('class')).toContain(
      'y_2022',
    );
  });

  it('scrolls forward by n steps', async () => {
    expect(select('.graph-domain:nth-child(1)').attr('class')).toContain(
      'y_2020',
    );
    expect(select('.graph-domain:nth-child(2)').attr('class')).toContain(
      'y_2021',
    );
    expect(selectAll('.graph-domain').nodes().length).toBe(2);

    await cal.next(5);

    expect(select('.graph-domain:nth-child(1)').attr('class')).toContain(
      'y_2025',
    );
    expect(select('.graph-domain:nth-child(2)').attr('class')).toContain(
      'y_2026',
    );
  });

  it('can not scroll past the minDate', async () => {
    cal.init({ date: { min: new Date(2015, 0, 1) } });
    expect(select('.graph-domain:nth-child(1)').attr('class')).toContain(
      'y_2020',
    );
    expect(select('.graph-domain:nth-child(2)').attr('class')).toContain(
      'y_2021',
    );
    expect(selectAll('.graph-domain').nodes().length).toBe(2);

    await cal.previous(10);
    expect(select('.graph-domain:nth-child(1)').attr('class')).toContain(
      'y_2015',
    );
    expect(select('.graph-domain:nth-child(2)').attr('class')).toContain(
      'y_2016',
    );
  });

  it('can not scroll past the maxDate', async () => {
    cal.init({ date: { max: new Date(2025, 0, 1) } });
    expect(select('.graph-domain:nth-child(1)').attr('class')).toContain(
      'y_2020',
    );
    expect(select('.graph-domain:nth-child(2)').attr('class')).toContain(
      'y_2021',
    );
    expect(selectAll('.graph-domain').nodes().length).toBe(2);

    await cal.next(10);
    expect(select('.graph-domain:nth-child(1)').attr('class')).toContain(
      'y_2024',
    );
    expect(select('.graph-domain:nth-child(2)').attr('class')).toContain(
      'y_2025',
    );
  });

  it('jumpsTo a past date', async () => {
    expect(select('.graph-domain:nth-child(1)').attr('class')).toContain(
      'y_2020',
    );
    expect(select('.graph-domain:nth-child(2)').attr('class')).toContain(
      'y_2021',
    );
    expect(selectAll('.graph-domain').nodes().length).toBe(2);

    await cal.jumpTo(new Date(2015, 6, 3));
    expect(select('.graph-domain:nth-child(1)').attr('class')).toContain(
      'y_2015',
    );
    expect(select('.graph-domain:nth-child(2)').attr('class')).toContain(
      'y_2016',
    );
  });

  it('jumpsTo a future date', async () => {
    expect(select('.graph-domain:nth-child(1)').attr('class')).toContain(
      'y_2020',
    );
    expect(select('.graph-domain:nth-child(2)').attr('class')).toContain(
      'y_2021',
    );
    expect(selectAll('.graph-domain').nodes().length).toBe(2);

    await cal.jumpTo(new Date(2025, 6, 3));
    expect(select('.graph-domain:nth-child(1)').attr('class')).toContain(
      'y_2024',
    );
    expect(select('.graph-domain:nth-child(2)').attr('class')).toContain(
      'y_2025',
    );
  });

  it('jumpsTo a future date with reset', async () => {
    expect(select('.graph-domain:nth-child(1)').attr('class')).toContain(
      'y_2020',
    );
    expect(select('.graph-domain:nth-child(2)').attr('class')).toContain(
      'y_2021',
    );
    expect(selectAll('.graph-domain').nodes().length).toBe(2);

    await cal.jumpTo(new Date(2025, 6, 3), true);
    expect(select('.graph-domain:nth-child(1)').attr('class')).toContain(
      'y_2025',
    );
    expect(select('.graph-domain:nth-child(2)').attr('class')).toContain(
      'y_2026',
    );
  });

  it('jumpsTo a date inside the current calendar range', async () => {
    expect(select('.graph-domain:nth-child(1)').attr('class')).toContain(
      'y_2020',
    );
    expect(select('.graph-domain:nth-child(2)').attr('class')).toContain(
      'y_2021',
    );
    expect(selectAll('.graph-domain').nodes().length).toBe(2);

    await cal.jumpTo(new Date(2020, 6, 3));
    expect(select('.graph-domain:nth-child(1)').attr('class')).toContain(
      'y_2020',
    );
    expect(select('.graph-domain:nth-child(2)').attr('class')).toContain(
      'y_2021',
    );
  });
});
