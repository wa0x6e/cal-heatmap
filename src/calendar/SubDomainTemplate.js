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

  init(templates) {
    const { options } = this.calendar.options;
    let userTemplates = [];
    if (templates) {
      if (!Array.isArray(templates)) {
        userTemplates.push(templates);
      } else {
        userTemplates = templates;
      }
    }

    [...DefaultTemplates, ...userTemplates].forEach((f) => {
      const template = f(this.calendar.helpers.DateHelper, options);
      this.settings[template.name] = template;
    });
  }
}
