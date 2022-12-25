import {
  mergeWith, isEqual, has, get, set,
} from 'lodash-es';

import OptionsPreProcessors from './OptionsPreProcessors';

export type DomainOptions = {
  type: string;
  gutter: number;
  padding: [number, number, number, number];
  dynamicDimension: boolean;
  label: LabelOptions;
  sort: 'asc' | 'desc';
};

type LabelOptions = {
  text?: string | null | ((timestamp: number, element: SVGElement) => string);
  position: string;
  textAlign: string;
  offset: {
    x: number;
    y: number;
  };
  rotate: null | 'left' | 'right';
  width: number;
  height: number;
};

export type SubDomainOptions = {
  type: string;
  width: number;
  height: number;
  gutter: number;
  radius: number;
  label:
  | string
  | null
  | ((timestamp: number, value: number, element: SVGElement) => string);
  color?:
  | string
  | ((timestamp: number, value: number, backgroundColor: string) => string);
};

type DateOptions = {
  start: Date;
  min?: Date;
  max?: Date;
  highlight: Date[];
  timezone?: string;
  locale: string;
};

export type DataOptions = {
  source: any;
  type: string;
  requestInit: object;
  x: string | ((datum: any) => number);
  y: string | ((data: any[]) => number[]);
  groupY: string | ((values: number[]) => number);
};

type ScaleOptions = {
  as: string;
  [key: string]: any;
};

type LegendOptions = {
  show: boolean;
  itemSelector: string | null;
  label: string | null;
  width: number;
};

export type OptionsType = {
  itemSelector: string;
  range: number;
  domain: DomainOptions;
  subDomain: SubDomainOptions;
  dayLabel: boolean;
  date: DateOptions;
  data: DataOptions;
  scale: ScaleOptions;
  legend: LegendOptions;
  animationDuration: number;
  verticalOrientation: boolean;
};

type InternalOptionsType = {
  x: {
    domainHorizontalLabelWidth: number;
    domainVerticalLabelHeight: number;
  };
};

export default class Options {
  options: OptionsType & InternalOptionsType;

  preProcessors: {
    [key: string]: (value: any) => any;
  };

  constructor(processors = OptionsPreProcessors) {
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

        // Whether to show most recent date first
        sort: 'asc',

        label: {
          // Formatting of the domain label
          // @default: undefined, will use the formatting
          // according to domain type
          // Accept a string used as specifier by moment().format()
          // or a function
          //
          // Refer to https://momentjs.com/docs/#/displaying/
          // for accepted date formatting used by moment().format()
          text: undefined,

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
          height: 25,
        },
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

        // Formatting of the text inside each subDomain cell
        // @default: null, no text
        // Accept a string used as specifier by moment().format()
        // or a function
        //
        // Refer to https://momentjs.com/docs/#/displaying/
        // for accepted date formatting used by moment().format()
        label: null,

        color: undefined,
      },

      // Show weekday's name when showing full month
      dayLabel: false,

      date: {
        // Start date of the graph
        // @default now
        start: new Date(),

        min: undefined,

        max: undefined,

        // List of dates to highlight
        // Valid values:
        // - []: don't highlight anything
        // - an array of Date objects: highlight the specified dates
        highlight: [],

        // Timezone of the calendar
        // When undefined, will default to browser local timezone
        timezone: undefined,

        // MomentJS locale
        locale: 'en',
      },

      // Calendar orientation
      // false: display domains side by side
      // true : display domains one under the other
      verticalOrientation: false,

      data: {
        // Data source
        // URL, where to fetch the original datas
        source: '',

        // Data type
        // Default: json
        type: 'json',

        requestInit: {},

        // keyname of the time property
        x: '',

        // keyname of the value property
        y: '',

        // Grouping function of the values
        groupY: 'sum',
      },

      scale: {
        as: 'color',
        type: 'quantize',
        domain: [0, 100],
        scheme: 'YlOrBr',
      },

      // Legend properties
      legend: {
        // Whether to display the legend
        show: false,

        itemSelector: null,

        label: null,

        width: 130,
      },

      // Animation duration, in ms
      animationDuration: 200,

      // Internally used options, do not edit not set
      x: {
        domainHorizontalLabelWidth: 0,
        domainVerticalLabelHeight: 0,
      },
    };
  }

  /**
   * Set a new value for an option, only if unchanged
   * @param {string} key   Name of the option
   * @param {any} value Value of the option
   * @return {boolean} Whether the option have been changed
   */
  set(key: string, value: any): boolean {
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

  init(opts: any): void {
    this.options = {
      // eslint-disable-next-line arrow-body-style
      ...mergeWith(this.options, opts, (objValue, srcValue) => {
        return Array.isArray(srcValue) ? srcValue : undefined;
      }),
    };

    const { options } = this;

    Object.keys(this.preProcessors).forEach((key) => {
      set(options, key, get(this.preProcessors, key)(get(options, key)));
    });

    options.x.domainVerticalLabelHeight = options.domain.label.height;

    // When the label is affecting the height
    if (
      options.domain.label.position === 'top' ||
      options.domain.label.position === 'bottom'
    ) {
      options.x.domainHorizontalLabelWidth = 0;
    } else {
      options.x.domainVerticalLabelHeight = 0;
      options.x.domainHorizontalLabelWidth = options.domain.label.width;
    }

    if (
      options.domain.label.text === null ||
      options.domain.label.text === ''
    ) {
      options.x.domainVerticalLabelHeight = 0;
      options.x.domainHorizontalLabelWidth = 0;
    }
  }
}
