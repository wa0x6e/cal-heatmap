import EventEmmiter from 'eventemitter3';

import Navigator from './calendar/Navigator';
import CalendarPainter from './calendar/CalendarPainter';
import Populator from './calendar/Populator';
import Options from './calendar/Options';
import Colorizer from './calendar/Colorizer';
import DomainCollection from './calendar/DomainCollection';

import extractSVG from './utils/extractSVG';
// eslint-disable-next-line import/no-unresolved
import './cal-heatmap.scss';

import { getDatas } from './data';

import SubDomainTemplate from './calendar/SubDomainTemplate';

import {
  RESET_ALL_ON_UPDATE,
  SCROLL_FORWARD,
  SCROLL_BACKWARD,
} from './constant';

export default class CalHeatmap {
  constructor() {
    // Default settings
    this.options = new Options(this);

    this.subDomainTemplate = new SubDomainTemplate(this);

    this.navigator = new Navigator(this);
    this.populator = new Populator(this);

    this.calendarPainter = new CalendarPainter(this);
    this.colorizer = new Colorizer(this);
    this.helpers = {};
    this.eventEmitter = new EventEmmiter();
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
   * Setup and paint the calendar with the given options
   *
   * @param  {Object} settings Options
   * @return void
   */
  init(settings) {
    const { options } = this.options;

    this.options.init(settings);

    this.colorizer.build();
    this.calendarPainter.setup();

    // Record all the valid domains
    // Each domain value is a timestamp in milliseconds
    this.domainCollection = new DomainCollection(this.helpers.DateHelper);
    this.navigator.loadNewDomains(
      this.createDomainCollection(options.start, options.range),
    );
    this.calendarPainter.paint();

    this.update();
  }

  /**
   * Shift the calendar by n domains forward
   *
   * @param {number} Number of domain interval to shift
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
   *
   * @param {number} Number of domain interval to shift
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
   * @param {boolean} reset Whether the wanted domain
   * should be the first domain of the calendar
   * @param {boolean} True of the calendar was scrolled
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
      },
      afterLoadDataCallback,
      updateMode,
    );
  }

  /**
   * Set the legend
   *
   * @since 3.3.0
   * @param {Object} Same object as the legend option
   */
  setLegend(legendOptions) {
    const changeResults = [];

    changeResults.push(this.options.set('legend', legendOptions));

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
   * @since 3.3.0
   * @return {boolean} False if there is no legend to remove
   */
  removeLegend() {
    if (!this.options.set('legend.show', false)) {
      return false;
    }
    return this.calendarPainter.removeLegend();
  }

  /**
   * Display the legend
   *
   * @since 3.3.0
   * @return {boolean} False if the legend was already displayed
   */
  showLegend() {
    if (!this.options.set('legend.show', true)) {
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
   * @return {boolean} True if dates were highlighted
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
   * Listener for all events
   *
   * @since 4.0.0
   * @param  {string} eventName Name of the event to listen to
   * @param  {function} Callback function to execute on event trigger
   * @return void
   */
  on(...args) {
    this.eventEmitter.on(...args);
  }

  /**
   * Destroy the calendar
   *
   * @since  3.3.6
   * @param {function} A callback function to trigger
   * after destroying the calendar
   * @return void
   */
  destroy(callback) {
    this.calendarPainter.destroy(callback);
  }

  getSVG() {
    return extractSVG(this.calendarPainter.root, this.options.options);
  }
}
