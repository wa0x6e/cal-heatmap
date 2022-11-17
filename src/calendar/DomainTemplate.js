import DefaultTemplates from './templates';
import DateHelper from '../utils/DateHelper';

export default class DomainTemplate {
  constructor(calendar) {
    this.settings = {};
    this.calendar = calendar;
    this.dateHelper = new DateHelper();
  }

  getSubDomainRowNumber(d) {
    const { options } = this.calendar.options;

    if (options.colLimit > 0) {
      let i = this.settings[options.subDomain].maxItemNumber;
      if (typeof i === 'function') {
        i = i(d);
      }
      return Math.ceil(i / options.colLimit);
    }

    let j = this.settings[options.subDomain].defaultRowNumber;
    if (typeof j === 'function') {
      j = j(d);
    }
    return options.rowLimit || j;
  }

  getSubDomainColumnNumber(d) {
    const { options } = this.calendar.options;

    if (options.rowLimit > 0) {
      let i = this.settings[options.subDomain].maxItemNumber;
      if (typeof i === 'function') {
        i = i(d);
      }
      return Math.ceil(i / options.rowLimit);
    }

    let j = this.settings[options.subDomain].defaultColumnNumber;
    if (typeof j === 'function') {
      j = j(d);
    }
    return options.colLimit || j;
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
      const template = f(this, this.dateHelper, options);
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
