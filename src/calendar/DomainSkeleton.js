import {
  getDayOfYear,
  getWeekDay,
  getWeekNumber,
  getMonthWeekNumber,
  getDayCountInMonth,
  getDayCountInYear,
} from '../date';

export default class DomainSkeleton {
  constructor(calendar) {
    this.settings = {};
    this.calendar = calendar;
  }

  #getSubDomainRowNumber(d) {
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

  #getSubDomainColumnNumber(d) {
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

  compute() {
    const { options } = this.calendar.options;
    const self = this;
    this.settings = {
      min: {
        name: 'minute',
        level: 10,
        maxItemNumber: 60,
        defaultRowNumber: 10,
        defaultColumnNumber: 6,
        row(d) {
          return self.#getSubDomainRowNumber(d);
        },
        column(d) {
          return self.#getSubDomainColumnNumber(d);
        },
        position: {
          x(d) {
            return Math.floor(d.getMinutes() / self.settings.min.row(d));
          },
          y(d) {
            return d.getMinutes() % self.settings.min.row(d);
          },
        },
        format: {
          date: '%H:%M, %A %B %-e, %Y',
          legend: '',
          connector: 'at',
        },
        extractUnit(d) {
          return new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate(),
            d.getHours(),
            d.getMinutes(),
          ).getTime();
        },
      },
      hour: {
        name: 'hour',
        level: 20,
        maxItemNumber(d) {
          switch (options.domain) {
            case 'day':
              return 24;
            case 'week':
              return 24 * 7;
            case 'month':
              return (
                24 *
                (options.domainDynamicDimension ? getDayCountInMonth(d) : 31)
              );
          }
        },
        defaultRowNumber: 6,
        defaultColumnNumber(d) {
          switch (options.domain) {
            case 'day':
              return 4;
            case 'week':
              return 28;
            case 'month':
              return options.domainDynamicDimension
                ? getDayCountInMonth(d)
                : 31;
          }
        },
        row(d) {
          return self.#getSubDomainRowNumber(d);
        },
        column(d) {
          return self.#getSubDomainColumnNumber(d);
        },
        position: {
          x(d) {
            if (options.domain === 'month') {
              if (options.colLimit > 0 || options.rowLimit > 0) {
                return Math.floor(
                  (d.getHours() + (d.getDate() - 1) * 24) /
                    self.settings.hour.row(d),
                );
              }
              return (
                Math.floor(d.getHours() / self.settings.hour.row(d)) +
                (d.getDate() - 1) * 4
              );
            }
            if (options.domain === 'week') {
              if (options.colLimit > 0 || options.rowLimit > 0) {
                return Math.floor(
                  (d.getHours() +
                    getWeekDay(d, options.weekStartOnMonday) * 24) /
                    self.settings.hour.row(d),
                );
              }
              return (
                Math.floor(d.getHours() / self.settings.hour.row(d)) +
                getWeekDay(d, options.weekStartOnMonday) * 4
              );
            }
            return Math.floor(d.getHours() / self.settings.hour.row(d));
          },
          y(d) {
            let p = d.getHours();
            if (options.colLimit > 0 || options.rowLimit > 0) {
              switch (options.domain) {
                case 'month':
                  p += (d.getDate() - 1) * 24;
                  break;
                case 'week':
                  p += getWeekDay(d, options.weekStartOnMonday) * 24;
                  break;
              }
            }
            return Math.floor(p % self.settings.hour.row(d));
          },
        },
        format: {
          date: '%Hh, %A %B %-e, %Y',
          legend: '%H:00',
          connector: 'at',
        },
        extractUnit(d) {
          return new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate(),
            d.getHours(),
          ).getTime();
        },
      },
      day: {
        name: 'day',
        level: 30,
        maxItemNumber(d) {
          switch (options.domain) {
            case 'week':
              return 7;
            case 'month':
              return options.domainDynamicDimension
                ? getDayCountInMonth(d)
                : 31;
            case 'year':
              return options.domainDynamicDimension
                ? getDayCountInYear(d)
                : 366;
          }
        },
        defaultColumnNumber(d) {
          d = new Date(d);
          switch (options.domain) {
            case 'week':
              return 1;
            case 'month':
              return options.domainDynamicDimension &&
                !options.verticalOrientation
                ? getWeekNumber(
                    new Date(d.getFullYear(), d.getMonth() + 1, 0),
                  ) -
                    getWeekNumber(d) +
                    1
                : 6;
            case 'year':
              return options.domainDynamicDimension
                ? getWeekNumber(new Date(d.getFullYear(), 11, 31)) -
                    getWeekNumber(new Date(d.getFullYear(), 0)) +
                    1
                : 54;
          }
        },
        defaultRowNumber: 7,
        row(d) {
          return self.#getSubDomainRowNumber(d);
        },
        column(d) {
          return self.#getSubDomainColumnNumber(d);
        },
        position: {
          x(d) {
            switch (options.domain) {
              case 'week':
                return Math.floor(
                  getWeekDay(d, options.weekStartOnMonday) /
                    self.settings.day.row(d),
                );
              case 'month':
                if (options.colLimit > 0 || options.rowLimit > 0) {
                  return Math.floor(
                    (d.getDate() - 1) / self.settings.day.row(d),
                  );
                }
                return (
                  getWeekNumber(d) -
                  getWeekNumber(new Date(d.getFullYear(), d.getMonth()))
                );
              case 'year':
                if (options.colLimit > 0 || options.rowLimit > 0) {
                  return Math.floor(
                    (getDayOfYear(d) - 1) / self.settings.day.row(d),
                  );
                }
                return getWeekNumber(d);
            }
          },
          y(d) {
            let p = getWeekDay(d, options.weekStartOnMonday);
            if (options.colLimit > 0 || options.rowLimit > 0) {
              switch (options.domain) {
                case 'year':
                  p = getDayOfYear(d) - 1;
                  break;
                case 'week':
                  p = getWeekDay(d, options.weekStartOnMonday);
                  break;
                case 'month':
                  p = d.getDate() - 1;
                  break;
              }
            }
            return Math.floor(p % self.settings.day.row(d));
          },
        },
        format: {
          date: '%A %B %-e, %Y',
          legend: '%e %b',
          connector: 'on',
        },
        extractUnit(d) {
          return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        },
      },
      week: {
        name: 'week',
        level: 40,
        maxItemNumber: 54,
        defaultColumnNumber(d) {
          d = new Date(d);
          switch (options.domain) {
            case 'year':
              return self.settings.week.maxItemNumber;
            case 'month':
              return options.domainDynamicDimension
                ? getWeekNumber(
                    new Date(d.getFullYear(), d.getMonth() + 1, 0),
                  ) - getWeekNumber(d)
                : 5;
          }
        },
        defaultRowNumber: 1,
        row(d) {
          return self.#getSubDomainRowNumber(d);
        },
        column(d) {
          return self.#getSubDomainColumnNumber(d);
        },
        position: {
          x(d) {
            switch (options.domain) {
              case 'year':
                return Math.floor(getWeekNumber(d) / self.settings.week.row(d));
              case 'month':
                return Math.floor(
                  getMonthWeekNumber(d) / self.settings.week.row(d),
                );
            }
          },
          y(d) {
            return getWeekNumber(d) % self.settings.week.row(d);
          },
        },
        format: {
          date: '%B Week #%W',
          legend: '%B Week #%W',
          connector: 'in',
        },
        extractUnit(d) {
          const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          // According to ISO-8601, week number computation are based on week starting on Monday
          let weekDay = dt.getDay() - (options.weekStartOnMonday ? 1 : 0);
          if (weekDay < 0) {
            weekDay = 6;
          }
          dt.setDate(dt.getDate() - weekDay);
          return dt.getTime();
        },
      },
      month: {
        name: 'month',
        level: 50,
        maxItemNumber: 12,
        defaultColumnNumber: 12,
        defaultRowNumber: 1,
        row() {
          return self.#getSubDomainRowNumber();
        },
        column() {
          return self.#getSubDomainColumnNumber();
        },
        position: {
          x(d) {
            return Math.floor(d.getMonth() / self.settings.month.row(d));
          },
          y(d) {
            return d.getMonth() % self.settings.month.row(d);
          },
        },
        format: {
          date: '%B %Y',
          legend: '%B',
          connector: 'in',
        },
        extractUnit(d) {
          return new Date(d.getFullYear(), d.getMonth()).getTime();
        },
      },
      year: {
        name: 'year',
        level: 60,
        row() {
          return options.rowLimit || 1;
        },
        column() {
          return options.colLimit || 1;
        },
        position: {
          x() {
            return 1;
          },
          y() {
            return 1;
          },
        },
        format: {
          date: '%Y',
          legend: '%Y',
          connector: 'in',
        },
        extractUnit(d) {
          return new Date(d.getFullYear()).getTime();
        },
      },
    };

    for (const type in self.settings) {
      if (self.settings.hasOwnProperty(type)) {
        const d = self.settings[type];
        self.settings[`x_${type}`] = {
          name: `x_${type}`,
          level: d.type,
          maxItemNumber: d.maxItemNumber,
          defaultRowNumber: d.defaultRowNumber,
          defaultColumnNumber: d.defaultColumnNumber,
          row: d.column,
          column: d.row,
          position: {
            x: d.position.y,
            y: d.position.x,
          },
          format: d.format,
          extractUnit: d.extractUnit,
        };
      }
    }
  }
}
