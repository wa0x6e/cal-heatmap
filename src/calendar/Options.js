import {
  mergeWith,
  isEqual,
  castArray,
  isFunction,
  isString,
  isNumber,
  has,
  get,
  set,
} from 'lodash-es';

import {
  TOP, RIGHT, BOTTOM, LEFT, X,
} from '../constant';
import DateHelper from '../helpers/DateHelper';

const ALLOWED_DATA_TYPES = ['json', 'csv', 'tsv', 'txt'];
const DEFAULT_LEGEND_MARGIN = 10;

/**
 * Ensure that the domain and subdomain are valid
 *
 * @throw {Error} when domain or subdomain are not valid
 * @return {bool} True if domain and subdomain are valid and compatible
 */
function validateDomainType(subDomainTemplate, { domain, subDomain }) {
  if (!subDomainTemplate.has(domain) || domain === 'minute') {
    throw new Error(`The domain '${domain}' is not valid`);
  }

  if (!subDomainTemplate.has(subDomain) || subDomain === 'year') {
    throw new Error(`The subDomain '${subDomain}' is not valid`);
  }

  if (
    subDomainTemplate.at(domain).level <= subDomainTemplate.at(subDomain).level
  ) {
    throw new Error(`'${subDomain}' is not a valid subDomain to '${domain}'`);
  }

  return true;
}

const preProcessors = {
  highlight: (args) => castArray(args),
  itemName: (name) => {
    if (isString(name)) {
      return [name, name + (name !== '' ? 's' : '')];
    }

    if (Array.isArray(name)) {
      if (name.length === 1) {
        return [name[0], `${name[0]}s`];
      }
      if (name.length > 2) {
        return name.slice(0, 2);
      }
    }
    return name;
  },
  cellSize: (value) => {
    if (isNumber(value)) {
      return [value, value];
    }

    return value;
  },
  'legend.cellSize': (args) => preProcessors.cellSize(args),
  domainMargin: (args) => preProcessors.margins(args),
  'legend.margin': (args) => preProcessors.margins(args),
  margins: (settings) => {
    let value = settings;
    if (isNumber(value)) {
      value = [value];
    }

    if (!Array.isArray(value) || !value.every((d) => isNumber(d))) {
      // eslint-disable-next-line no-console
      console.log('Margin only accepts an integer or an array of integers');
      value = [0];
    }

    switch (value.length) {
      case 1:
        return [value[0], value[0], value[0], value[0]];
      case 2:
        return [value[0], value[1], value[0], value[1]];
      case 3:
        return [value[0], value[1], value[2], value[1]];
      default:
        return value.slice(0, 4);
    }
  },
  'formatter.subDomainLabel': (value) =>
    // eslint-disable-next-line
    ((isString(value) && value !== '') || isFunction(value) ? value : null),
  'formatter.domainLabel': (value, calendar, options) =>
    // eslint-disable-next-line
    (isString(value) || isFunction(value) ?
      value :
      calendar.subDomainTemplate.at(options.domain).format.legend),
};

export default class Options {
  constructor(calendar) {
    this.calendar = calendar;

    this.options = {
      // selector string of the container to append the graph to
      // Accept any string value accepted by document.querySelector or CSS3
      // or an Element object
      itemSelector: '#cal-heatmap',

      // ================================================
      // DOMAIN
      // ================================================

      // Number of domain to display on the graph
      range: 12,

      // Size of each cell, in pixel
      // Accepts either:
      // - a number, representing the width and height of each square cell
      // - an array of 2 numbers, in the format [width, height]
      cellSize: 10,

      // Padding between each cell, in pixel
      cellPadding: 2,

      // For rounded subdomain rectangles, in pixels
      cellRadius: 0,

      domainGutter: 2,

      domainMargin: [0, 0, 0, 0],

      domain: 'hour',

      subDomain: 'minute',

      subDomainTemplate: null,

      // Show weekday's name when showing full month
      dayLabel: false,

      // Start date of the graph
      // @default now
      start: new Date(),

      minDate: null,

      maxDate: null,

      // ================================================
      // DATA
      // ================================================

      // Data source
      // URL, where to fetch the original datas
      data: '',

      // Data type
      // Default: json
      dataType: ALLOWED_DATA_TYPES[0],

      // Payload sent when using POST http method
      // Leave to null (default) for GET request
      // Expect a string, formatted like "a=b;c=d"
      dataPostPayload: null,

      // Additional headers sent when requesting data
      // Expect an object formatted like:
      // { 'X-CSRF-TOKEN': 'token' }
      dataRequestHeaders: null,

      // Whether to consider missing date:value from the datasource
      // as equal to 0, or just leave them as missing
      considerMissingDataAsZero: false,

      // Timezone of the calendar
      // When null, will default to browser local timezone
      timezone: null,

      // Calendar orientation
      // false: display domains side by side
      // true : display domains one under the other
      verticalOrientation: false,

      // Domain dynamic width/height
      // The width on a domain depends on the number of
      domainDynamicDimension: true,

      // Domain Label properties
      label: {
        // valid: top, right, bottom, left
        position: 'bottom',

        // Valid are the direct svg values: start, middle, end
        textAlign: 'middle',

        // By default, there is no margin/padding around the label
        offset: {
          x: 0,
          y: 0,
        },

        rotate: null,

        // Used only on vertical orientation
        width: 100,

        // Used only on horizontal orientation
        height: null,
      },

      // ================================================
      // LEGEND
      // ================================================

      // Threshold for the legend
      legend: {
        steps: [10, 20, 30, 40],

        // Whether to display the legend
        show: true,

        cellSize: 10,

        cellPadding: 2,

        // Legend rotation
        // false: display the legend from left to right
        // true : display the legend from top to bottom
        verticalOrientation: false,

        margin: [0, 0, 0, 0],

        // Legend vertical position
        // top: place legend above calendar
        // bottom: place legend below the calendar
        verticalPosition: 'bottom',

        // Legend horizontal position
        // accepted values: left, center, right
        horizontalPosition: 'left',

        // Objects holding all the heatmap different colors
        // null to disable, and use the default css styles
        //
        // Examples:
        // colors: {
        //    min: "green",
        //    middle: "blue",
        //    max: "red",
        //    empty: "#ffffff",
        //    base: "grey",
        //    overflow: "red"
        // }
        colors: null,
      },

      // ================================================
      // HIGHLIGHT
      // ================================================

      // List of dates to highlight
      // Valid values:
      // - []: don't highlight anything
      // - an array of Date objects: highlight the specified dates
      highlight: [],

      // ================================================
      // TEXT FORMATTING / i18n
      // ================================================

      // MomentJS locale
      locale: 'en',

      // Name of the items to represent in the calendar
      itemName: ['item', 'items'],

      formatter: {
        // Formatting of the domain label
        // @default: undefined, will use the formatting according to domain type
        // Accept a string used as specifier by moment().format()
        // or a function
        //
        // Refer to https://momentjs.com/docs/#/displaying/
        // for accepted date formatting used by moment().format()
        domainLabel: undefined,

        // Formatting of the text inside each subDomain cell
        // @default: null, no text
        // Accept a string used as specifier by moment().format()
        // or a function
        //
        // Refer to https://momentjs.com/docs/#/displaying/
        // for accepted date formatting used by moment().format()
        subDomainLabel: null,

        // Formatting of the title displayed when hovering a subDomain cell
        // This will also be the tooltip's text when enabled
        // Expecting a function, which is returning the title's text
        subDomainTitleFn: (date, value) => `${value} - ${date}`,
      },

      // Formatting of the title displayed when hovering a legend cell
      legendTitleFormat: {
        lower: 'less than {min} {name}',
        inner: 'between {down} and {up} {name}',
        upper: 'more than {max} {name}',
      },

      // Animation duration, in ms
      animationDuration: 200,

      // Whether to show tooltip on subDomain hover
      // To format its content, see formatter/subDomainTitleFn option
      tooltip: false,

      // Callback after fetching the datas,
      // but before applying them to the calendar
      // Used mainly to convert the datas if they're not formatted like expected
      // Takes the fetched "data" object as argument, must return a json object
      // formatted like {timestamp:count, timestamp2:count2},
      dataProcessor: (data) => data,
    };
  }

  /**
   * Set a new value for an option, only if unchanged
   * @param {string} key   Name of the option
   * @param {any} value Value of the option
   * @return {boolean} Whether the option have been changed
   */
  set(key, value) {
    if (!has(this.options, key) || isEqual(get(this.options, key), value)) {
      return false;
    }

    set(
      this.options,
      key,
      has(preProcessors, key) ? get(preProcessors, key)(value) : value,
    );

    return true;
  }

  #validate() {
    const { options } = this;

    // Fatal errors
    // Stop script execution on error
    validateDomainType(this.calendar.subDomainTemplate, this.options);

    if (!ALLOWED_DATA_TYPES.includes(options.dataType)) {
      throw new Error(
        `The data type '${options.dataType}' is not valid data type`,
      );
    }

    if (!options.hasOwnProperty('subDomain')) {
      throw new Error('The subDomain options is missing');
    }

    return true;
  }

  init(settings) {
    this.options = {
      // eslint-disable-next-line arrow-body-style
      ...mergeWith(this.options, settings, (objValue, srcValue) => {
        return Array.isArray(srcValue) ? srcValue : undefined;
      }),
      x: {},
    };

    const { options } = this;

    this.calendar.helpers.DateHelper = new DateHelper(
      options.locale,
      options.timezone,
    );
    this.calendar.subDomainTemplate.init(options.subDomainTemplates);
    this.#validate();

    Object.keys(preProcessors).forEach((key) => {
      if (!has(options, key)) {
        return;
      }
      set(
        options,
        key,
        get(preProcessors, key)(get(options, key), this.calendar, options),
      );
    });

    options.x.domainVerticalLabelHeight =
      options.label.height ?? options.cellSize[X] * 2;

    // When the label is affecting the height
    if (
      options.label.position === 'top' ||
      options.label.position === 'bottom'
    ) {
      options.x.domainHorizontalLabelWidth = 0;
    } else {
      options.x.domainVerticalLabelHeight = 0;
      options.x.domainHorizontalLabelWidth = options.label.width;
    }

    if ([false, '', null].includes(options.formatter.domainLabel)) {
      options.x.domainVerticalLabelHeight = 0;
      options.x.domainHorizontalLabelWidth = 0;
    }

    if (options.legend.margin === [0, 0, 0, 0]) {
      switch (options.legend.verticalPosition) {
        case 'top':
          options.legend.margin[BOTTOM] = DEFAULT_LEGEND_MARGIN;
          break;
        case 'bottom':
          options.legend.margin[TOP] = DEFAULT_LEGEND_MARGIN;
          break;
        case 'middle':
        case 'center':
          options.legend.margin[
            options.legend.horizontalPosition === 'right' ? LEFT : RIGHT
          ] = DEFAULT_LEGEND_MARGIN;
          break;
        default:
      }
    }
  }
}
