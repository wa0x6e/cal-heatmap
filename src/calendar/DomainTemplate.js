import DefaultTemplates from './templates';
import DateHelper from '../utils/DateHelper';

export default class DomainTemplate {
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
      const template = f(DateHelper, options);
      this.settings[template.name] = template;
    });

    Object.keys(this.settings).forEach((type) => {
      const template = this.settings[type];

      this.settings[`x_${type}`] = {
        name: `x_${type}`,
        level: template.type,
        maxItemNumber: template.maxItemNumber,
        defaultRowNumber: template.defaultRowNumber,
        defaultColumnNumber: template.defaultColumnNumber,
        row: template.column,
        column: template.row,
        position: {
          x: template.position.y,
          y: template.position.x,
        },
        format: template.format,
        extractUnit: template.extractUnit,
      };
    });
  }
}
