import castArray from 'lodash-es/castArray';

import DefaultTemplates from './templates/index';
import type Options from '../options/Options';
import type { Template, TemplateResult } from '../index';
import type DateHelper from '../helpers/DateHelper';

export default class TemplateCollection {
  dateHelper: DateHelper;

  options: Options;

  settings: Map<string, TemplateResult>;

  constructor(dateHelper: DateHelper, options: Options) {
    this.settings = new Map();
    this.dateHelper = dateHelper;
    this.options = options;
  }

  get(domainType: string) {
    return this.settings.get(domainType);
  }

  has(domainType: string): boolean {
    return this.settings.has(domainType);
  }

  init() {
    this.add(DefaultTemplates);
  }

  add(templates: Template | Template[]) {
    castArray(templates).forEach((f) => {
      const template = f(this.dateHelper, this.options.options);
      this.settings.set(template.name, template);
    });
  }
}
