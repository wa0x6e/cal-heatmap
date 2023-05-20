import mergeWith from 'lodash-es/mergeWith';
import isEqual from 'lodash-es/isEqual';
import has from 'lodash-es/has';
import get from 'lodash-es/get';
import set from 'lodash-es/set';
import type { Ls } from 'dayjs';
import type { DomainType, Timestamp } from '../index';
import {
  OPTIONS_DEFAULT_DOMAIN_TYPE,
  OPTIONS_DEFAULT_SUBDOMAIN_TYPE,
  OPTIONS_DEFAULT_SUBDOMAIN_WIDTH,
  OPTIONS_DEFAULT_SUBDOMAIN_HEIGHT,
  OPTIONS_DEFAULT_SUBDOMAIN_GUTTER,
  OPTIONS_DEFAULT_SUBDOMAIN_RADIUS,
  OPTIONS_DEFAULT_THEME,
  OPTIONS_DEFAULT_ANIMATION_DURATION,
  OPTIONS_DEFAULT_ITEM_SELECTOR,
  OPTIONS_DEFAULT_RANGE,
  SCALE_BASE_COLOR_SCHEME,
  SCALE_BASE_COLOR_TYPE,
  SCALE_BASE_COLOR_DOMAIN,
  OPTIONS_DEFAULT_LOCALE,
} from '../constant';

import OptionsPreProcessors from './OptionsPreProcessors';

type SortOrder = 'asc' | 'desc';
export type TextAlign = 'start' | 'middle' | 'end';
export type Padding = [number, number, number, number];

export type DomainOptions = {
  type: DomainType;
  gutter: number;
  padding: Padding;
  dynamicDimension: boolean;
  label: LabelOptions;
  sort: SortOrder;
};

type LabelOptions = {
  text?:
  | string
  | null
  | ((timestamp: Timestamp, element: SVGElement) => string);
  position: 'top' | 'right' | 'bottom' | 'left';
  textAlign: TextAlign;
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
  | ((timestamp: Timestamp, value: number, element: SVGElement) => string);
  color?:
  | string
  | ((
    timestamp: Timestamp,
    value: number | string | null | undefined,
    backgroundColor: string,
  ) => string);
  sort: SortOrder;
};

export type DataGroupType = 'sum' | 'count' | 'min' | 'max' | 'average';

type DateOptions = {
  start: Date;
  min?: Date;
  max?: Date;
  highlight: Date[];
  locale: string | Partial<(typeof Ls)[0]>;
  timezone?: string;
};

export type DataRecord = Record<string, string | number>;
export type DataOptions = {
  source: string | DataRecord[];
  type: 'json' | 'csv' | 'tsv' | 'txt';
  requestInit: object;
  x: string | ((datum: DataRecord) => number);
  y: string | ((datum: DataRecord) => number);
  groupY:
  | DataGroupType
  | ((values: (string | number | null)[]) => string | number | null);
  defaultValue: null | number | string;
};

type ScaleOptions = {
  opacity?: {
    domain: number[];
    type?: string;
    baseColor: string;
  };
  color?: {
    domain: number[];
    scheme?: string;
    range?: string[];
    interpolate?: any;
    type?: string;
  };
};

export type OptionsType = {
  itemSelector: string;
  range: number;
  domain: DomainOptions;
  subDomain: SubDomainOptions;
  date: DateOptions;
  data: DataOptions;
  scale?: ScaleOptions;
  animationDuration: number;
  verticalOrientation: boolean;
  theme: 'light' | 'dark';
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
      itemSelector: OPTIONS_DEFAULT_ITEM_SELECTOR,

      // Number of domain to display on the graph
      range: OPTIONS_DEFAULT_RANGE,

      domain: {
        type: OPTIONS_DEFAULT_DOMAIN_TYPE,

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
          // Accept any string accepted by dayjs.format()
          // or a function
          //
          // Refer to https://day.js.org/docs/en/display/format
          // for list of accepted string tokens used by dayjs.format()
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
        type: OPTIONS_DEFAULT_SUBDOMAIN_TYPE,

        // Width of each subDomain cell, in pixel
        width: OPTIONS_DEFAULT_SUBDOMAIN_WIDTH,

        // Height of each subDomain cell, in pixel
        height: OPTIONS_DEFAULT_SUBDOMAIN_HEIGHT,

        // Space between each subDomain cell, in pixel
        gutter: OPTIONS_DEFAULT_SUBDOMAIN_GUTTER,

        // Radius of each subDomain cell, in pixel
        radius: OPTIONS_DEFAULT_SUBDOMAIN_RADIUS,

        // Formatting of the text inside each subDomain cell
        // @default: null, no text
        // Accept any string accepted by dayjs.format()
        // or a function
        //
        // Refer to https://day.js.org/docs/en/display/format
        // for list of accepted string tokens used by dayjs.format()
        label: null,

        color: undefined,

        sort: 'asc',
      },

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

        locale: OPTIONS_DEFAULT_LOCALE,

        timezone: undefined,
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

        defaultValue: null,
      },

      scale: undefined,

      // Animation duration, in ms
      animationDuration: OPTIONS_DEFAULT_ANIMATION_DURATION,

      // Theme mode: dark/light
      theme: OPTIONS_DEFAULT_THEME,

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

  init(opts?: CalHeatmap.DeepPartial<OptionsType>): void {
    this.options = {
      // eslint-disable-next-line arrow-body-style
      ...mergeWith(this.options, opts, (_, srcValue) => {
        return Array.isArray(srcValue) ? srcValue : undefined;
      }),
    };

    const { options } = this;

    Object.keys(this.preProcessors).forEach((key) => {
      set(options, key, get(this.preProcessors, key)(get(options, key)));
    });

    if (typeof options.scale === 'undefined') {
      this.initScale();
    }

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

  initScale() {
    this.options.scale = {
      color: {
        scheme: SCALE_BASE_COLOR_SCHEME,
        type: SCALE_BASE_COLOR_TYPE,
        domain: SCALE_BASE_COLOR_DOMAIN,
      },
    };
  }
}
