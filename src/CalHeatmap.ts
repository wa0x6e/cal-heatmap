import EventEmmiter from 'eventemitter3';
import castArray from 'lodash-es/castArray';
import type { PluginFunc } from 'dayjs';
import type dayjs from 'dayjs';

import Navigator from './calendar/Navigator';
import CalendarPainter from './calendar/CalendarPainter';
import Populator from './calendar/Populator';
import Options from './options/Options';
import DataFetcher from './DataFetcher';
import DomainCollection from './calendar/DomainCollection';
import DateHelper from './helpers/DateHelper';
import validate from './options/OptionsValidator';
import PluginManager from './plugins/PluginManager';
import VERSION from './version';

import './cal-heatmap.scss';

import TemplateCollection from './TemplateCollection';

import type { OptionsType } from './options/Options';
import type {
  Template,
  Dimensions,
  PluginDefinition,
  Timestamp,
} from './index';

import { ScrollDirection } from './constant';

export default class CalHeatmap {
  static VERSION = VERSION;

  options: Options;

  calendarPainter: CalendarPainter;

  populator: Populator;

  navigator: Navigator;

  eventEmitter: EventEmmiter;

  dataFetcher: DataFetcher;

  domainCollection!: DomainCollection;

  templateCollection: TemplateCollection;

  dateHelper: DateHelper;

  pluginManager: PluginManager;

  constructor() {
    // Default options
    this.options = new Options();

    // Init the helpers with the default options
    this.dateHelper = new DateHelper();
    this.templateCollection = new TemplateCollection(
      this.dateHelper,
      this.options,
    );
    this.dataFetcher = new DataFetcher(this);
    this.navigator = new Navigator(this);
    this.populator = new Populator(this);

    this.calendarPainter = new CalendarPainter(this);
    this.eventEmitter = new EventEmmiter();
    this.pluginManager = new PluginManager(this);
  }

  createDomainCollection(
    startDate: Timestamp | Date,
    range: number | Date,
    excludeEnd: boolean = true,
  ): DomainCollection {
    return new DomainCollection(
      this.dateHelper,
      this.options.options.domain.type,
      startDate,
      range,
      excludeEnd,
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
  async paint(
    options?: CalHeatmap.DeepPartial<OptionsType>,
    plugins?: PluginDefinition[] | PluginDefinition,
  ): Promise<unknown> {
    this.options.init(options);
    await this.dateHelper.setup(this.options);

    this.templateCollection.init();

    try {
      validate(this.templateCollection, this.options.options);
    } catch (error) {
      return Promise.reject(error);
    }

    if (plugins) {
      this.pluginManager.add(castArray(plugins as any) as PluginDefinition[]);
    }

    this.calendarPainter.setup();

    // Record all the valid domains
    // Each domain value is a timestamp in milliseconds
    this.domainCollection = new DomainCollection(this.dateHelper);
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
    const endDate = this.dateHelper.intervals(
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
  on(name: string, fn: (...args: any[]) => any): void {
    this.eventEmitter.on(name, fn);
  }

  dimensions(): Dimensions {
    return this.calendarPainter.dimensions;
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

  extendDayjs(plugin: PluginFunc): dayjs.Dayjs {
    return this.dateHelper.extend(plugin);
  }
}
