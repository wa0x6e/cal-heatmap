import { castArray } from 'lodash-es';

import DefaultTemplates from './templates';

export default class SubDomainTemplate {
  constructor(calendar) {
    this.settings = {};
    this.calendar = calendar;
  }

  at(domain) {
    return this.settings[domain];
  }

  has(domain) {
    return this.settings.hasOwnProperty(domain);
  }

  init() {
    this.add(DefaultTemplates);
  }

  add(templates) {
    castArray(templates).forEach((f) => {
      const template = f(this.calendar.helpers, this.calendar.options.options);
      this.settings[template.name] = template;
    });
  }
}
