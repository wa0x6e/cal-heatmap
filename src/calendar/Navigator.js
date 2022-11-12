import { NAVIGATE_RIGHT, NAVIGATE_LEFT } from '../constant';
import { generateDomain } from '../domain/domainGenerator';
import { getDatas } from '../data';
import { getSubDomain } from '../subDomain';

export default class Navigator {
  constructor(calendar) {
    this.calendar = calendar;
    this.maxDomainReached = false;
    this.minDomainReached = false;
  }

  loadNextDomain(n) {
    if (this.maxDomainReached || n === 0) {
      return false;
    }

    const bound = this.loadNewDomains(
      NAVIGATE_RIGHT,
      generateDomain(
        this.calendar.options.domain,
        this.calendar.getNextDomain(),
        this.calendar.options.weekStartOnMonday,
        n
      )
    );

    this.afterLoadNextDomain(bound.end);
    this.checkIfMaxDomainIsReached(
      this.calendar.getNextDomain().getTime(),
      bound.start
    );

    return true;
  }

  loadPreviousDomain(n) {
    if (this.minDomainReached || n === 0) {
      return false;
    }

    const bound = this.loadNewDomains(
      NAVIGATE_LEFT,
      generateDomain(
        this.calendar.options.options.domain,
        this.calendar.getDomainKeys()[0],
        this.calendar.options.options.weekStartOnMonday,
        -n
      ).reverse()
    );

    this.afterLoadPreviousDomain(bound.start);
    this.checkIfMinDomainIsReached(bound.start, bound.end);

    return true;
  }

  jumpTo(date, reset) {
    const domains = this.calendar.getDomainKeys();
    const firstDomain = domains[0];
    const lastDomain = domains[domains.length - 1];

    if (date < firstDomain) {
      return this.loadPreviousDomain(
        generateDomain(
          this.calendar.options.domain,
          firstDomain,
          this.calendar.options.weekStartOnMonday,
          date
        ).length
      );
    }
    if (reset) {
      return this.loadNextDomain(
        generateDomain(
          this.calendar.options.domain,
          firstDomain,
          this.calendar.options.weekStartOnMonday,
          date
        ).length
      );
    }

    if (date > lastDomain) {
      return this.loadNextDomain(
        generateDomain(
          this.calendar.options.domain,
          lastDomain,
          this.calendar.options.weekStartOnMonday,
          date
        ).length
      );
    }

    return false;
  }

  loadNewDomains(direction, newDomains) {
    const backward = direction === NAVIGATE_LEFT;
    let i = -1;
    let total = newDomains.length;
    let domains = this.calendar.getDomainKeys();
    const { options } = this.calendar.options;

    function buildSubDomain(d) {
      return {
        t: this.calendar.domainSkeleton
          .at(this.calendar.options.subDomain)
          .extractUnit(d),
        v: null,
      };
    }

    // Remove out of bound domains from list of new domains to prepend
    while (++i < total) {
      if (backward && this.minDomainIsReached(newDomains[i])) {
        newDomains = newDomains.slice(0, i + 1);
        break;
      }
      if (!backward && this.maxDomainIsReached(newDomains[i])) {
        newDomains = newDomains.slice(0, i);
        break;
      }
    }

    newDomains = newDomains.slice(-options.range);

    for (i = 0, total = newDomains.length; i < total; i++) {
      this.domainCollection.set(
        newDomains[i].getTime(),
        getSubDomain(newDomains[i], options, this.DTSDomain).map(buildSubDomain)
      );

      this.domainCollection.delete(backward ? domains.pop() : domains.shift());
    }

    domains = this.calendar.getDomainKeys();

    if (backward) {
      newDomains = newDomains.reverse();
    }

    this.calendar.calendarPainter.paint(direction);

    getDatas(
      this.calendar,
      options,
      options.data,
      newDomains[0],
      getSubDomain(
        newDomains[newDomains.length - 1],
        options,
        this.calendar.DTSDomain
      ).pop(),
      () => {
        this.calendar.fill(this.calendar.lastInsertedSvg);
      }
    );

    return {
      start: newDomains[backward ? 0 : 1],
      end: domains[domains.length - 1],
    };
  }

  setMinDomainReached(status) {
    this.minDomainReached = status;
  }

  setMaxDomainReached(status) {
    this.maxDomainReached = status;
  }

  /**
   * Return whether a date is inside the scope determined by maxDate
   *
   * @param int datetimestamp The timestamp in ms to test
   * @return bool True if the specified date correspond to the calendar upper bound
   */
  maxDomainIsReached(datetimestamp) {
    const { maxDate } = this.calendar.options.options;
    return maxDate !== null && maxDate.getTime() < datetimestamp;
  }

  /**
   * Return whether a date is inside the scope determined by minDate
   *
   * @param int datetimestamp The timestamp in ms to test
   * @return bool True if the specified date correspond to the calendar lower bound
   */
  minDomainIsReached(datetimestamp) {
    const { minDate } = this.calendar.options.options;

    return minDate !== null && minDate.getTime() >= datetimestamp;
  }
}
