import EventEmmiter from 'eventemitter3';
import { isFunction } from 'lodash-es';

import Navigator from './calendar/Navigator';
import CalendarPainter from './calendar/CalendarPainter';
import Populator from './calendar/Populator';
import Options from './options/Options';
import DataFetcher from './DataFetcher';
import DomainCollection from './calendar/DomainCollection';
import createHelpers from './helpers/HelperFactory';

import extractSVG from './utils/extractSVG';
// eslint-disable-next-line import/no-unresolved
// import './cal-heatmap.scss';

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
    this.dataFetcher = new DataFetcher(this);

    this.navigator = new Navigator(this);
    this.populator = new Populator(this);
    this.helpers = {};

    this.calendarPainter = new CalendarPainter(this);
    this.eventEmitter = new EventEmmiter();
  }

  createDomainCollection(startDate, range) {
    return new DomainCollection(
      this.helpers,
      this.options.options.domain.type,
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
   * @return {boolean} True, unless there's an error
   */
  init(settings) {
    this.options.init(settings);

    this.helpers = createHelpers(this);
    this.subDomainTemplate.init();

    try {
      this.options.validate();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return false;
    }

    this.calendarPainter.setup();

    // Record all the valid domains
    // Each domain value is a timestamp in milliseconds
    this.domainCollection = new DomainCollection(this.helpers);
    this.navigator.loadNewDomains(
      this.createDomainCollection(
        this.options.options.date.start,
        this.options.options.range,
      ),
    );
    this.calendarPainter.paint();

    this.fill();

    return true;
  }

  /**
   * Add a new subDomainTemplate
   *
   * @since 4.0.0
   * @param  {Array<SubDomainTemplate> | SubDomainTemplate} templates
   * A single, or an array of SubDomainTemplate object
   * @return void
   */
  addTemplates(templates) {
    this.subDomainTemplate.add(templates);
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
    this.fill();
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
    this.fill();
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
    this.fill();
  }

  /**
   * Fill the calendar with some data
   *
   * @param  {object|string}    dataSource    The calendar's datasource,
   * same type as this.options.data.source
   * @param  {function}    dataProcessor  The dataProcessor function to
   * execute before processing your data
   */
  fill(
    dataSource = this.options.options.data.source,
    dataProcessor = this.options.options.data.processor,
    updateMode = RESET_ALL_ON_UPDATE,
  ) {
    const { options } = this.options;
    const template = this.subDomainTemplate;
    const endDate = this.helpers.DateHelper.intervals(
      options.domain.type,
      this.domainCollection.max,
      2,
    )[1];

    const dataPromise = this.dataFetcher.getDatas(
      dataSource,
      this.domainCollection.min,
      endDate,
    );

    dataPromise.then((data) => {
      this.domainCollection.fill(
        isFunction(dataProcessor) ? dataProcessor(data) : data,
        updateMode,
        this.domainCollection.min,
        endDate,
        template.at(options.domain.type).extractUnit,
        template.at(options.subDomain.type).extractUnit,
      );
      this.populator.populate();
    });
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
