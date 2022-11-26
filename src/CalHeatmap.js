import Navigator from './calendar/Navigator';
import CalendarPainter from './calendar/CalendarPainter';
import Populator from './calendar/Populator';
import Options from './calendar/Options';
import Colorizer from './calendar/Colorizer';
import DomainCollection from './calendar/DomainCollection';

import extractSVG from './utils/extractSVG';

import { getDatas } from './data';

import SubDomainTemplate from './calendar/SubDomainTemplate';
import CalendarEvent from './calendar/CalendarEvent';

import {
  RESET_ALL_ON_UPDATE,
  SCROLL_FORWARD,
  SCROLL_BACKWARD,
} from './constant';

export default class CalHeatmap extends CalendarEvent {
  constructor(settings) {
    super();

    // Default settings
    this.options = new Options(this);

    this.subDomainTemplate = new SubDomainTemplate(this);

    this.navigator = new Navigator(this);
    this.populator = new Populator(this);

    this.calendarPainter = new CalendarPainter(this);
    this.colorizer = new Colorizer(this);
    this.helpers = {};

    this.#init(settings);
  }

  #init(settings) {
    const { options } = this.options;

    this.options.init(settings);

    // Record all the valid domains
    // Each domain value is a timestamp in milliseconds
    this.domainCollection = new DomainCollection(this.helpers.DateHelper);

    this.calendarPainter.setup();
    this.colorizer.build();

    this.navigator.loadNewDomains(
      this.createDomainCollection(options.start, options.range),
    );
    this.calendarPainter.paint();
    this.afterLoad();
    // Fill the graph with some datas
    if (options.loadOnInit) {
      this.update();
    } else {
      this.onComplete();
    }
  }

  createDomainCollection(startDate, range) {
    return new DomainCollection(
      this.helpers.DateHelper,
      this.options.options.domain,
      startDate,
      range,
    );
  }

  // =========================================================================
  // PUBLIC API
  // =========================================================================

  /**
   * Shift the calendar by n domains forward
   */
  next(n = 1) {
    const loadDirection = this.navigator.loadNewDomains(
      this.createDomainCollection(this.domainCollection.max, n + 1).slice(1),
      SCROLL_FORWARD,
    );
    this.calendarPainter.paint(loadDirection);
    // @TODO: Update only newly inserted domains
    this.update();
  }

  /**
   * Shift the calendar by n domains backward
   */
  previous(n = 1) {
    const loadDirection = this.navigator.loadNewDomains(
      this.createDomainCollection(this.domainCollection.min, -n),
      SCROLL_BACKWARD,
    );
    this.calendarPainter.paint(loadDirection);
    // @TODO: Update only newly inserted domains
    this.update();
  }

  /**
   * Jump directly to a specific date
   *
   * JumpTo will scroll the calendar until the wanted domain with the specified
   * date is visible. Unless you set reset to true, the wanted domain
   * will not necessarily be the first (leftmost) domain of the calendar.
   *
   * @param Date date Jump to the domain containing that date
   * @param bool reset Whether the wanted domain
   * should be the first domain of the calendar
   * @param bool True of the calendar was scrolled
   */
  jumpTo(date, reset = false) {
    const loadDirection = this.navigator.jumpTo(date, reset);
    this.calendarPainter.paint(loadDirection);
    // @TODO: Update only newly inserted domains
    this.update();
  }

  /**
   * Navigate back to the start date
   *
   * @since  3.3.8
   * @return void
   */
  rewind() {
    return this.jumpTo(this.options.options.start, true);
  }

  /**
   * Update the calendar with new data
   *
   * @param  object|string    dataSource    The calendar's datasource,
   * same type as this.options.data
   * @param  boolean|function    afterLoadDataCallback    Whether to
   * execute afterLoadDataCallback() on the data. Pass directly a function
   * if you don't want to use the afterLoadDataCallback() callback
   */
  update(
    dataSource = this.options.options.data,
    afterLoadDataCallback = this.options.options.afterLoadData,
    updateMode = RESET_ALL_ON_UPDATE,
  ) {
    const { options } = this.options;
    const endDate = this.helpers.DateHelper.intervals(
      options.domain,
      this.domainCollection.max,
      2,
    )[1];

    getDatas(
      this,
      options,
      dataSource,
      this.domainCollection.min,
      endDate,
      () => {
        this.populator.populate();
        this.afterUpdate();
        this.onComplete();
      },
      afterLoadDataCallback,
      updateMode,
    );
  }

  /**
   * Set the legend
   *
   * @param array legend an array of integer,
   * representing the different threshold value
   * @param array colorRange an array of 2 hex colors, for the
   * minimum and maximum colors
   */
  setLegend(legend, legendColors) {
    const changeResults = [];

    changeResults.push(this.options.set('legend', legend));
    changeResults.push(this.options.set('legendColors', legendColors));

    // Trigger repaint only if legend options have changed
    if (!changeResults.includes(true)) {
      return;
    }

    this.colorizer.build();
    this.calendarPainter.legendPainter.paint();
    this.populator.populate();
  }

  /**
   * Remove the legend
   *
   * @return bool False if there is no legend to remove
   */
  removeLegend() {
    if (!this.options.set('displayLegend', false)) {
      return false;
    }
    return this.calendarPainter.removeLegend();
  }

  /**
   * Display the legend
   *
   * @return bool False if the legend was already displayed
   */
  showLegend() {
    if (!this.options.set('displayLegend', true)) {
      return false;
    }

    return this.calendarPainter.showLegend();
  }

  /**
   * Highlight dates
   *
   * Add a highlight class to a set of dates
   *
   * @since  3.3.5
   * @param  array Array of dates to highlight
   * @return bool True if dates were highlighted
   */
  highlight(dates) {
    if (
      this.options.set('highlight', dates) &&
      this.options.options.highlight.length > 0
    ) {
      this.calendarPainter.highlight();
    }
  }

  /**
   * Destroy the calendar
   *
   * Usage: cal = cal.destroy();
   *
   * @since  3.3.6
   * @param function A callback function to trigger
   * after destroying the calendar
   * @return null
   */
  destroy(callback) {
    this.calendarPainter.destroy(callback);

    return null;
  }

  getSVG() {
    return extractSVG(this.calendarPainter.root, this.options.options);
  }
}
