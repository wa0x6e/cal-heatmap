import mergeWith from 'lodash-es/mergeWith';
import isEqual from 'lodash-es/isEqual';
import has from 'lodash-es/has';
import get from 'lodash-es/get';
import set from 'lodash-es/set';
import type { Moment } from 'moment';
import type { DomainType } from '../index';

import OptionsPreProcessors from './OptionsPreProcessors';

type DeepPartial<T> = T extends object
  ? {
    [P in keyof T]?: DeepPartial<T[P]>;
  }
  : T;

export type DomainOptions = {
  type: DomainType;
  gutter: number;
  padding: [number, number, number, number];
  dynamicDimension: boolean;
  label: LabelOptions;
  subLabel?: SubLabelOptions;
  sort: 'asc' | 'desc';
};

type LabelOptions = {
  text?: string | null | ((timestamp: number, element: SVGElement) => string);
  position: 'top' | 'right' | 'bottom' | 'left';
  textAlign: 'start' | 'middle' | 'end';
  offset: {
    x: number;
    y: number;
  };
  rotate: null | 'left' | 'right';
  width: number;
  height: number;
};

type SubLabelOptions = {
  text: (moment: Moment) => string[];
  radius?: number;
  width?: number;
  height?: number;
  gutter?: number;
  textAlign?: 'start' | 'middle' | 'end';
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

export type DataGroupType = 'sum' | 'count' | 'min' | 'max' | 'median';

type DateOptions = {
  start: Date;
  min?: Date;
  max?: Date;
  highlight: Date[];
  locale: string;
};

export type DataRecord = Record<string, string | number>;
export type DataOptions = {
  source: string | DataRecord[];
  type: 'json' | 'csv' | 'tsv' | 'txt';
  requestInit: object;
  x: string | ((datum: DataRecord) => number);
  y: string | ((datum: DataRecord) => number);
  groupY: DataGroupType | ((values: number[]) => number);
};

type ScaleOptions = {
  as: 'color' | 'opacity';
  [key: string]: any;
};

export type OptionsType = {
  itemSelector: string;
  range: number;
  domain: DomainOptions;
  subDomain: SubDomainOptions;
  date: DateOptions;
  data: DataOptions;
  scale: ScaleOptions;
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

        subLabel: undefined,
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

  init(opts?: DeepPartial<OptionsType>): void {
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
