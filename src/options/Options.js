import {
  mergeWith, isEqual, has, get, set,
} from 'lodash-es';

import preProcessors from './OptionsPreProcessors';
import validate from './OptionsValidator';

export default class Options {
  constructor(calendar, processors = preProcessors) {
    this.calendar = calendar;
    this.preProcessors = processors;

    this.options = {
      // selector string of the container to append the graph to
      // Accept any string value accepted by document.querySelector or CSS3
      // or an Element object
      itemSelector: '#cal-heatmap',

      // Number of domain to display on the graph
      range: 12,

      domain: {
        type: 'hour',

        // Space between each domain, in pixel
        gutter: 4,

        padding: [0, 0, 0, 0],

        // Whether to enable dynamic domain size
        // The width/height on a domain depends on the number of
        // subDomains items count
        dynamicDimension: true,
      },

      subDomain: {
        type: 'minute',

        // Width of each subDomain cell, in pixel
        width: 10,

        // Height of each subDomain cell, in pixel
        height: 10,

        // Space between each subDomain cell, in pixel
        gutter: 2,

        // Radius of each subDomain cell, in pixel
        radius: 0,
      },

      // Show weekday's name when showing full month
      dayLabel: false,

      date: {
        // Start date of the graph
        // @default now
        start: new Date(),

        min: null,

        max: null,

        // List of dates to highlight
        // Valid values:
        // - []: don't highlight anything
        // - an array of Date objects: highlight the specified dates
        highlight: [],
      },

      // Calendar orientation
      // false: display domains side by side
      // true : display domains one under the other
      verticalOrientation: false,

      // Whether to show most recent date first
      reversedDirection: false,

      // Data source
      // URL, where to fetch the original datas
      data: '',

      // Data type
      // Default: json
      dataType: 'json',

      // Payload sent when using POST http method
      // Leave to null (default) for GET request
      // Expect a string, formatted like "a=b;c=d"
      dataPostPayload: null,

      // Additional headers sent when requesting data
      // Expect an object formatted like:
      // { 'X-CSRF-TOKEN': 'token' }
      dataRequestHeaders: null,

      // Timezone of the calendar
      // When null, will default to browser local timezone
      timezone: null,

      // MomentJS locale
      locale: 'en',

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

      // Legend properties
      legend: {
        // Whether to display the legend
        show: false,

        itemSelector: null,

        label: null,

        color: {
          type: 'threshold',
          domains: [0, 50, 100],
        },
      },

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

      // Animation duration, in ms
      animationDuration: 200,

      // Whether to show tooltip on subDomain cell hover
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
      has(this.preProcessors, key) ?
        get(this.preProcessors, key)(value) :
        value,
    );

    return true;
  }

  /**
   * Validate options, and throw Error when critical options are invalid
   * @return {boolean} Returns true when there is no critical errors
   */
  validate() {
    validate(this.calendar.subDomainTemplate, this.options);

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

    Object.keys(this.preProcessors).forEach((key) => {
      set(options, key, get(this.preProcessors, key)(get(options, key)));
    });

    options.x.domainVerticalLabelHeight =
      options.label.height ?? options.subDomain.width * 2;

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
  }
}
