import EventEmmiter from 'eventemitter3';
import { castArray } from 'lodash-es';

import Navigator from './calendar/Navigator';
import CalendarPainter from './calendar/CalendarPainter';
import Populator from './calendar/Populator';
import Options from './options/Options';
import DataFetcher from './DataFetcher';
import DomainCollection from './calendar/DomainCollection';
import createHelpers from './helpers/HelperFactory';
import validate from './options/OptionsValidator';
import PluginManager from './PluginManager';

import './cal-heatmap.scss';

import TemplateCollection from './calendar/TemplateCollection';

import type { OptionsType } from './options/Options';
import type { Template } from './index';
import type { Helpers } from './helpers/HelperFactory';

import { ScrollDirection } from './constant';

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

  helpers: Helpers;

  pluginManager: PluginManager;

  constructor() {
    // Default options
    this.options = new Options();

    // Init the helpers with the default options
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
    this.pluginManager = new PluginManager(this);
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
   * @param  {Object} options The Options object
   * @return A Promise, which will fulfill once all the underlying asynchronous
   * tasks settle, whether resolved or rejected.
   */
  paint(
    options?: DeepPartial<OptionsType>,
    plugins?: Array<[any, any?]> | [any, any?],
  ): Promise<unknown> {
    this.options.init(options);

    // Refresh the helpers with the correct options
    this.helpers = createHelpers(this.options);
    this.templateCollection.init();

    try {
      validate(this.templateCollection, this.options.options);
    } catch (error) {
      return Promise.reject(error);
    }

    if (plugins) {
      this.pluginManager.add(castArray(plugins));
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

    return Promise.allSettled([this.calendarPainter.paint(), this.fill()]);
  }

  /**
   * Add a new subDomainTemplate
   *
   * @since 4.0.0
   * @param  {SubDomainTemplate[] | SubDomainTemplate} templates
   * A single, or an array of SubDomainTemplate object
   * @return void
   */
  addTemplates(templates: Template | Template[]): void {
    this.templateCollection.add(templates);
  }

  /**
   * Shift the calendar by n domains forward
   *
   * @param {number} n Number of domain intervals to shift forward
   * @return A Promise, which will fulfill once all the underlying asynchronous
   * tasks settle, whether resolved or rejected.
   */
  next(n: number = 1): Promise<unknown> {
    const loadDirection = this.navigator.loadNewDomains(
      this.createDomainCollection(this.domainCollection.max, n + 1).slice(n),
      ScrollDirection.SCROLL_FORWARD,
    );

    return Promise.allSettled([
      this.calendarPainter.paint(loadDirection),
      this.fill(),
    ]);
  }

  /**
   * Shift the calendar by n domains backward
   *
   * @param {number} n Number of domain intervals to shift backward
   * @return A Promise, which will fulfill once all the underlying asynchronous
   * tasks settle, whether resolved or rejected.
   */
  previous(n: number = 1): Promise<unknown> {
    const loadDirection = this.navigator.loadNewDomains(
      this.createDomainCollection(this.domainCollection.min, -n),
      ScrollDirection.SCROLL_BACKWARD,
    );

    return Promise.allSettled([
      this.calendarPainter.paint(loadDirection),
      this.fill(),
    ]);
  }

  /**
   * Jump directly to a specific date
   *
   * JumpTo will scroll the calendar until the wanted domain with the specified
   * date is visible. Unless you set reset to true, the wanted domain
   * will not necessarily be the first domain of the calendar.
   *
   * @param {Date} date Jump to the domain containing that date
   * @param {boolean} reset Whether the wanted domain
   * should be the first domain of the calendar
   * @return A Promise, which will fulfill once all the underlying asynchronous
   * tasks settle, whether resolved or rejected.
   */
  jumpTo(date: Date, reset: boolean = false): Promise<unknown> {
    return Promise.allSettled([
      this.calendarPainter.paint(this.navigator.jumpTo(date, reset)),
      this.fill(),
    ]);
  }

  /**
   * Fill the calendar with the given data
   *
   * @param  {Object|string}    dataSource    The calendar's datasource,
   * same type as `options.data.source`
   * @return A Promise, which will fulfill once all the underlying asynchronous
   * tasks settle, whether resolved or rejected.
   */
  fill(dataSource = this.options.options.data.source): Promise<unknown> {
    const { options } = this.options;
    const template = this.templateCollection;
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

    return new Promise((resolve, reject) => {
      dataPromise.then(
        (data: any) => {
          this.domainCollection.fill(
            data,
            options.data,
            this.domainCollection.min,
            endDate,
            template.get(options.domain.type)!.extractUnit,
            template.get(options.subDomain.type)!.extractUnit,
          );
          this.populator.populate();
          resolve(null);
        },
        (error) => {
          reject(error);
        },
      );
    });
  }

  /**
   * Listener for all events
   *
   * @since 4.0.0
   * @param  {string}  eventName  Name of the event to listen to
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
   * @return A Promise, which will fulfill once all the underlying asynchronous
   * tasks settle, whether resolved or rejected.
   */
  destroy(): Promise<unknown> {
    return this.calendarPainter.destroy();
  }
}
