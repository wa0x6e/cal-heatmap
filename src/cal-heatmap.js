import { isEqual } from 'lodash-es';

import Navigator from './calendar/Navigator';
import CalendarPainter from './calendar/CalendarPainter';
import Populator from './calendar/Populator';
import Options from './calendar/Options';
import Colorizer from './calendar/Colorizer';

import extractSVG from './utils/extractSVG';

import { getDatas } from './data';

import SubDomainTemplate from './calendar/SubDomainTemplate';
import CalendarEvent from './calendar/CalendarEvent';

import { RESET_ALL_ON_UPDATE } from './constant';

export default class CalHeatMap extends CalendarEvent {
  constructor() {
    super();

    // Default settings
    this.options = new Options(this);

    this.subDomainTemplate = new SubDomainTemplate(this);

    // Record all the valid domains
    // Each domain value is a timestamp in milliseconds
    this.domainCollection = new Map();

    this.navigator = new Navigator(this);
    this.populator = new Populator(this);

    this.calendarPainter = new CalendarPainter(this);
    this.colorizer = new Colorizer(this);
    this.helpers = {};
  }

  /**
   * Return the list of the calendar's domain timestamp
   *
   * @return Array a sorted array of timestamp
   */
  getDomainKeys() {
    return Array.from(this.domainCollection.keys()).sort();
  }

  getDomainBoundKeys() {
    const keys = this.getDomainKeys();

    return {
      min: keys[0],
      max: keys[keys.length - 1],
    };
  }

  // =========================================================================
  // PUBLIC API
  // =========================================================================

  init(settings) {
    const { options } = this.options;

    this.options.init(settings);

    this.calendarPainter.setup();
    this.colorizer.build();

    this.navigator.loadNewDomains(
      this.helpers.DateHelper.generateTimeInterval(
        options.domain,
        options.start,
        options.range,
      ),
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

  /**
   * Shift the calendar by n domains forward
   */
  next(n = 1) {
    const loadDirection = this.navigator.loadNextDomain(n);
    this.calendarPainter.paint(loadDirection);
    // @TODO: Update only newly inserted domains
    this.update();
  }

  /**
   * Shift the calendar by n domains backward
   */
  previous(n = 1) {
    const loadDirection = this.navigator.loadPreviousDomain(n);
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
   * @param bool reset Whether the wanted domain should be the first domain of the calendar
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
    return this.navigator.jumpTo(this.options.options.start, true);
  }

  /**
   * Update the calendar with new data
   *
   * @param  object|string    dataSource    The calendar's datasource, same type as this.options.data
   * @param  boolean|function    afterLoadDataCallback    Whether to execute afterLoadDataCallback() on the data. Pass directly a function
   * if you don't want to use the afterLoadDataCallback() callback
   */
  update(
    dataSource = this.options.options.data,
    afterLoadDataCallback = this.options.options.afterLoadData,
    updateMode = RESET_ALL_ON_UPDATE,
  ) {
    const { options } = this.options;
    const domainsBound = this.getDomainBoundKeys();
    const endTimestamp = this.helpers.DateHelper.generateTimeInterval(
      options.domain,
      domainsBound.max,
      2,
    )[1];

    getDatas(
      this,
      options,
      dataSource,
      domainsBound.min,
      endTimestamp,
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
   * @param array legend an array of integer, representing the different threshold value
   * @param array colorRange an array of 2 hex colors, for the minimum and maximum colors
   */
  setLegend() {
    const { options } = this.options;
    const { legend, legendColors } = this.options.options;

    const oldLegend = options.legend.slice(0);
    if (arguments.length >= 1 && Array.isArray(arguments[0])) {
      legend = arguments[0];
    }
    if (arguments.length >= 2) {
      if (Array.isArray(arguments[1]) && arguments[1].length >= 2) {
        legendColors = [arguments[1][0], arguments[1][1]];
      } else {
        legendColors = arguments[1];
      }
    }

    if (
      (arguments.length > 0 &&
        !isEqual([...oldLegend].sort(), [...legend].sort())) ||
      arguments.length >= 2
    ) {
      this.calendarPainter.legend.buildColors();
      this.populator.populate();
    }

    this.calendarPainter.legend.paint();
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
   * @param function A callback function to trigger after destroying the calendar
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
