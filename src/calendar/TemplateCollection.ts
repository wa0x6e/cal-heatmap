import { castArray } from 'lodash-es';

import DefaultTemplates from './templates/index';
import type Options from '../options/Options';

export default class TemplateCollection {
  helpers: any;

  options: Options;

  settings: {
    [key: string]: any;
  };

  constructor(helpers: any, options: Options) {
    this.settings = {};
    this.helpers = helpers;
    this.options = options;
  }

  at(domainType: string) {
    return this.settings[domainType];
  }

  has(domainType: string) {
    return this.settings.hasOwnProperty(domainType);
  }

  init() {
    this.add(DefaultTemplates);
  }

  add(templates: any) {
    castArray(templates).forEach((f) => {
      const template = f(this.helpers, this.options.options);
      this.settings[template.name] = template;
    });
  }
}
