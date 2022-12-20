import EventEmmiter from 'eventemitter3';
import { isFunction } from 'lodash-es';

import Navigator from './calendar/Navigator';
import CalendarPainter from './calendar/CalendarPainter';
import Populator from './calendar/Populator';
import Options from './options/Options';
import DataFetcher from './DataFetcher';
import DomainCollection from './calendar/DomainCollection';
import createHelpers from './helpers/HelperFactory';
import validate from './options/OptionsValidator';

// import extractSVG from './utils/extractSVG';
import './cal-heatmap.scss';

import TemplateCollection from './calendar/TemplateCollection';

import type { OptionsType } from './options/Options';

import { FillStrategy, ScrollDirection } from './constant';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export default class CalHeatmap {
  options: Options;

  calendarPainter: CalendarPainter;

  populator: Populator;

  navigator: Navigator;

  eventEmitter: EventEmmiter;

  dataFetcher: DataFetcher;

  domainCollection!: DomainCollection;

  templateCollection: TemplateCollection;

  helpers: any;

  constructor() {
    // Default settings
    this.options = new Options();

    // Init the helpers with the default settings
    this.helpers = createHelpers(this.options);
    this.templateCollection = new TemplateCollection(
      this.helpers,
      this.options,
    );
    this.dataFetcher = new DataFetcher(this.options);

    this.navigator = new Navigator(this);
    this.populator = new Populator(this);

    this.calendarPainter = new CalendarPainter(this);
    this.eventEmitter = new EventEmmiter();
  }

  createDomainCollection(
    startDate: number | Date,
    range: number | Date,
  ): DomainCollection {
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
  paint(settings: DeepPartial<OptionsType>): boolean {
    this.options.init(settings);

    // Refresh the helpers with the correct options
    this.helpers = createHelpers(this.options);
    this.templateCollection.init();

    try {
      validate(this.templateCollection, this.options.options);
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
  addTemplates(templates: any) {
    this.templateCollection.add(templates);
  }

  /**
   * Shift the calendar by n domains forward
   *
   * @param {number} Number of domain interval to shift
   */
  next(n: number = 1) {
    const loadDirection = this.navigator.loadNewDomains(
      this.createDomainCollection(this.domainCollection.max!, n + 1).slice(n),
      ScrollDirection.SCROLL_FORWARD,
    );
    const promise = this.calendarPainter.paint(loadDirection);
    // @TODO: Update only newly inserted domains
    this.fill();

    return promise;
  }

  /**
   * Shift the calendar by n domains backward
   *
   * @param {number} Number of domain interval to shift
   */
  previous(n: number = 1) {
    const loadDirection = this.navigator.loadNewDomains(
      this.createDomainCollection(this.domainCollection.min!, -n),
      ScrollDirection.SCROLL_BACKWARD,
    );
    const promise = this.calendarPainter.paint(loadDirection);
    // @TODO: Update only newly inserted domains
    this.fill();

    return promise;
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
  jumpTo(date: Date, reset: boolean = false) {
    const loadDirection = this.navigator.jumpTo(date, reset);
    const promise = this.calendarPainter.paint(loadDirection);
    // @TODO: Update only newly inserted domains
    this.fill();

    return promise;
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
    updateMode: FillStrategy = FillStrategy.RESET_ALL_ON_UPDATE,
  ): void {
    const { options } = this.options;
    const template = this.templateCollection;
    const endDate = this.helpers.DateHelper.intervals(
      options.domain.type,
      this.domainCollection.max,
      2,
    )[1];

    const dataPromise = this.dataFetcher.getDatas(
      dataSource,
      this.domainCollection.min!,
      endDate,
    );

    dataPromise.then((data: any) => {
      this.domainCollection.fill(
        isFunction(dataProcessor) ? dataProcessor(data) : data,
        updateMode,
        this.domainCollection.min!,
        endDate,
        template.at(options.domain.type).extractUnit,
        template.at(options.subDomain.type).extractUnit,
      );
      this.populator.populate();
    });
  }

  /**
   * Listener for all events
   *
   * @since 4.0.0
   * @param  {string} eventName Name of the event to listen to
   * @param  {function} Callback function to execute on event trigger
   * @return void
   */
  on(name: string, fn: () => any): void {
    this.eventEmitter.on(name, fn);
  }

  /**
   * Destroy the calendar
   *
   * @since  3.3.6
   * @param {function} A callback function to trigger
   * after destroying the calendar
   * @return void
   */
  destroy(callback?: () => any): void {
    this.calendarPainter.destroy(callback);
  }

  // getSVG() {
  //   return extractSVG(this.calendarPainter.root, this.options.options);
  // }
}
