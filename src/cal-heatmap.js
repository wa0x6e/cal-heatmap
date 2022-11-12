import Navigator from './calendar/Navigator';
import CalendarPainter from './calendar/CalendarPainter';
import Populator from './calendar/Populator';
import Options from './calendar/Options';
import { arrayEquals } from './function';

import extractSVG from './extractSVG';

import { generateDomain } from './domain/domainGenerator';
import { getDatas } from './data';
import { getSubDomain } from './subDomain';
import { jumpDate } from './date';
import DomainSkeleton from './calendar/DomainSkeleton';

import { RESET_ALL_ON_UPDATE } from './constant';

export default class CalHeatMap {
  constructor() {
    // Default settings
    this.options = new Options(this);

    this.domainSkeleton = new DomainSkeleton(this);

    this.statusComplete = false;

    // Record all the valid domains
    // Each domain value is a timestamp in milliseconds
    this.domainCollection = new Map();

    this.navigator = new Navigator(this);
    this.populator = new Populator(this);

    // List of domains that are skipped because of DST
    // All times belonging to these domains should be re-assigned to the previous domain
    this.DSTDomain = [];
    this.calendarPainter = new CalendarPainter(this);
  }

  init(settings) {
    this.options.merge(settings);
    this.domainSkeleton.compute();
    this.options.validate();
    this.options.init();

    const { options } = this.options;

    // Init the DomainCollection
    generateDomain(
      options.domain,
      options.start,
      options.weekStartOnMonday,
      options.range
    )
      .map(d => d.getTime())
      .map(d => {
        this.domainCollection.set(
          d,
          getSubDomain(d, options, this.DTSDomain).map(d => ({
            t: this.domainSkeleton.at(options.subDomain).extractUnit(d),
            v: null,
          }))
        );
      });

    this.calendarPainter.setup();

    if (options.paintOnLoad) {
      this.calendarPainter.paint();
      this.afterLoad();

      const domains = this.getDomainKeys();

      // Fill the graph with some datas
      if (this.options.loadOnInit) {
        getDatas(
          this,
          options,
          options.data,
          new Date(domains[0]),
          getSubDomain(
            domains[domains.length - 1],
            options,
            this.DTSDomain
          ).pop(),
          () => {
            this.populator.populate();
            this.onComplete();
          }
        );
      } else {
        this.onComplete();
      }

      this.checkIfMinDomainIsReached(domains[0]);
      this.checkIfMaxDomainIsReached(this.getNextDomain().getTime());
    }
  }

  // =========================================================================//
  // EVENTS CALLBACK                              //
  // =========================================================================//

  /**
   * Helper method for triggering event callback
   *
   * @param  string  eventName       Name of the event to trigger
   * @param  array  successArgs     List of argument to pass to the callback
   * @param  boolean  skip      Whether to skip the event triggering
   * @return mixed  True when the triggering was skipped, false on error, else the callback function
   */
  triggerEvent(eventName, successArgs, skip) {
    if (
      (arguments.length === 3 && skip) ||
      this.options.options[eventName] === null
    ) {
      return true;
    }

    if (typeof this.options.options[eventName] === 'function') {
      if (typeof successArgs === 'function') {
        successArgs = successArgs();
      }
      return this.options.options[eventName].apply(this, successArgs);
    }
    console.log(`Provided callback for ${eventName} is not a function.`);
    return false;
  }

  /**
   * Event triggered on a mouse click on a subDomain cell
   *
   * @param  Date    d    Date of the subdomain block
   * @param  int    itemNb  Number of items in that date
   */
  onClick(d, itemNb) {
    return this.triggerEvent('onClick', [d, itemNb]);
  }

  /**
   * Event triggered when the mouse cursor enteres a subDomain cell
   *
   * @param  Date    d    Date of the subdomain block
   * @param  int    itemNb  Number of items in that date
   */
  onMouseOver(d, itemNb) {
    return this.triggerEvent('onMouseOver', [d, itemNb]);
  }

  /**
   * Event triggered when the mouse cursor leaves a subDomain cell
   *
   * @param  Date    d    Date of the subdomain block
   * @param  int    itemNb  Number of items in that date
   */
  onMouseOut(d, itemNb) {
    return this.triggerEvent('onMouseOut', [d, itemNb]);
  }

  /**
   * Event triggered after drawing the calendar, byt before filling it with data
   */
  afterLoad() {
    return this.triggerEvent('afterLoad');
  }

  /**
   * Event triggered after completing drawing and filling the calendar
   */
  onComplete() {
    const response = this.triggerEvent('onComplete', [], this.statusComplete);
    this.statusComplete = true;
    return response;
  }

  /**
   * Event triggered after resize event
   */
  onResize(h, w) {
    return this.triggerEvent('onResize', [h, w]);
  }

  /**
   * Event triggered after shifting the calendar one domain back
   *
   * @param  Date    start  Domain start date
   * @param  Date    end    Domain end date
   */
  afterLoadPreviousDomain(start) {
    return this.triggerEvent('afterLoadPreviousDomain', () => {
      const subDomain = getSubDomain(
        start,
        this.options.options,
        this.DTSDomain
      );
      return [subDomain.shift(), subDomain.pop()];
    });
  }

  /**
   * Event triggered after shifting the calendar one domain above
   *
   * @param  Date    start  Domain start date
   * @param  Date    end    Domain end date
   */
  afterLoadNextDomain(start) {
    return this.triggerEvent('afterLoadNextDomain', () => {
      const subDomain = getSubDomain(
        start,
        this.options.options,
        this.DTSDomain
      );
      return [subDomain.shift(), subDomain.pop()];
    });
  }

  /**
   * Event triggered after loading the leftmost domain allowed by minDate
   *
   * @param  boolean  reached True if the leftmost domain was reached
   */
  onMinDomainReached(reached) {
    this.navigator.minDomainReached = reached;
    return this.triggerEvent('onMinDomainReached', [reached]);
  }

  /**
   * Event triggered after loading the rightmost domain allowed by maxDate
   *
   * @param  boolean  reached True if the rightmost domain was reached
   */
  onMaxDomainReached(reached) {
    this.navigator.maxDomainReached = reached;
    return this.triggerEvent('onMaxDomainReached', [reached]);
  }

  checkIfMinDomainIsReached(date, upperBound) {
    const { navigator } = this;

    if (navigator.minDomainIsReached(date)) {
      this.onMinDomainReached(true);
    }

    if (arguments.length === 2) {
      if (
        navigator.maxDomainReached &&
        !navigator.maxDomainIsReached(upperBound)
      ) {
        this.onMaxDomainReached(false);
      }
    }
  }

  checkIfMaxDomainIsReached(date, lowerBound) {
    const { navigator } = this;

    if (navigator.maxDomainIsReached(date)) {
      this.onMaxDomainReached(true);
    }

    if (arguments.length === 2) {
      if (
        navigator.minDomainReached &&
        !navigator.minDomainIsReached(lowerBound)
      ) {
        this.onMinDomainReached(false);
      }
    }
  }

  afterUpdate() {
    return this.triggerEvent('afterUpdate');
  }

  /**
   * Return the list of the calendar's domain timestamp
   *
   * @return Array a sorted array of timestamp
   */
  getDomainKeys() {
    return Array.from(this.domainCollection.keys())
      .map(d => parseInt(d, 10))
      .sort((a, b) => a - b);
  }

  /**
   * Get the n-th next domain after the calendar newest (rightmost) domain
   * @param  int n
   * @return Date The start date of the wanted domain
   */
  getNextDomain(n = 1) {
    const { options } = this.options;

    return generateDomain(
      options.domain,
      jumpDate(this.getDomainKeys().pop(), n, options.domain),
      options.weekStartOnMonday,
      n
    )[0];
  }

  /**
   * Get the n-th domain before the calendar oldest (leftmost) domain
   * @param  int n
   * @return Date The start date of the wanted domain
   */
  getPreviousDomain(n = 1) {
    const { options } = this.options;

    return generateDomain(
      options.domain,
      jumpDate(this.getDomainKeys().shift(), -n, options.domain),
      options.weekStartOnMonday,
      n
    )[0];
  }

  /**
   * Handle the calendar layout and dimension
   *
   * Expand and shrink the container depending on its children dimension
   * Also rearrange the children position depending on their dimension,
   * and the legend position
   *
   * @return void
   */
  resize() {
    const painter = this.calendarPainter;

    painter.resize();
    this.onResize(painter.getHeight(), painter.getWidth());
  }

  // =========================================================================//
  // PUBLIC API                                //
  // =========================================================================//

  /**
   * Shift the calendar forward
   */
  next(n = 1) {
    return this.navigator.loadNextDomain(n);
  }

  /**
   * Shift the calendar backward
   */
  previous(n = 1) {
    return this.navigator.loadPreviousDomain(n);
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
    return this.navigator.jumpTo(date, reset);
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
   * @param  boolean|function    afterLoad    Whether to execute afterLoad() on the data. Pass directly a function
   * if you don't want to use the afterLoad() callback
   */
  update(
    dataSource = this.options.options.data,
    afterLoad = true,
    updateMode = RESET_ALL_ON_UPDATE
  ) {
    const domains = this.getDomainKeys();
    const self = this;
    getDatas(
      self,
      self.options.options,
      dataSource,
      new Date(domains[0]),
      getSubDomain(
        domains[domains.length - 1],
        self.options.options,
        self.DTSDomain
      ).pop(),
      () => {
        self.populator.populate();
        self.afterUpdate();
      },
      afterLoad,
      updateMode
    );
  }

  /**
   * Set the legend
   *
   * @param array legend an array of integer, representing the different threshold value
   * @param array colorRange an array of 2 hex colors, for the minimum and maximum colors
   */
  setLegend() {
    const oldLegend = this.options.options.legend.slice(0);
    if (arguments.length >= 1 && Array.isArray(arguments[0])) {
      this.options.options.legend = arguments[0];
    }
    if (arguments.length >= 2) {
      if (Array.isArray(arguments[1]) && arguments[1].length >= 2) {
        this.options.options.legendColors = [arguments[1][0], arguments[1][1]];
      } else {
        this.options.options.legendColors = arguments[1];
      }
    }

    if (
      (arguments.length > 0 &&
        !arrayEquals(oldLegend, this.options.options.legend)) ||
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
    if (this.options.set('displayLegend', true)) {
      return false;
    }

    return this.calendarPainter.legend.showLegend();
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
  highlight(args) {
    return this.calendarPainter.highlight(args);
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
