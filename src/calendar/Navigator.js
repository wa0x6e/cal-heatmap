import { NAVIGATE_RIGHT, NAVIGATE_LEFT } from '../constant';
import generateTimeInterval from '../utils/timeInterval';
import { getDatas } from '../data';
import { jumpDate } from '../date';
import { generateSubDomain } from '../subDomain/subDomainGenerator';

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

    const { options } = this.calendar.options;

    return this.loadNewDomains(
      generateTimeInterval(
        options.domain,
        this.calendar.getDomainKeys().pop(),
        typeof n === 'number' ? n + 1 : n,
      ).slice(1),
      NAVIGATE_RIGHT,
    );
  }

  loadPreviousDomain(n) {
    if (this.minDomainReached || n === 0) {
      return false;
    }

    const { options } = this.calendar.options;

    return this.loadNewDomains(
      generateTimeInterval(
        options.domain,
        this.calendar.getDomainKeys()[0],
        typeof n === 'number' ? -n : n,
      ),
      NAVIGATE_LEFT,
    );
  }

  jumpTo(date, reset) {
    const domains = this.calendar.getDomainKeys();
    const firstDomain = domains[0];
    const lastDomain = domains[domains.length - 1];
    const { options } = this.calendar.options;

    if (date < firstDomain) {
      return this.loadPreviousDomain(
        generateTimeInterval(options.domain, date, firstDomain).length,
      );
    }
    if (reset) {
      return this.loadNextDomain(
        generateTimeInterval(options.domain, firstDomain, date).length,
      );
    }

    if (date > lastDomain) {
      return this.loadNextDomain(
        generateTimeInterval(options.domain, lastDomain, date).length,
      );
    }

    return false;
  }

  loadNewDomains(newDomains, direction = NAVIGATE_RIGHT) {
    const backward = direction === NAVIGATE_LEFT;
    let i = -1;
    let total = newDomains.length;
    let domains = this.calendar.getDomainKeys();
    const { options } = this.calendar.options;

    // Remove out of bound domains from list of new domains to prepend
    while (++i < total) {
      if (backward && this.#minDomainIsReached(newDomains[i])) {
        newDomains = newDomains.slice(0, i + 1);
        break;
      }
      if (!backward && this.#maxDomainIsReached(newDomains[i])) {
        newDomains = newDomains.slice(0, i);
        break;
      }
    }

    newDomains = newDomains.slice(-options.range);

    for (i = 0, total = newDomains.length; i < total; i++) {
      this.calendar.domainCollection.set(
        newDomains[i],
        generateSubDomain(newDomains[i], options).map((d) => ({
          t: this.calendar.domainSkeleton
            .at(options.subDomain)
            .extractUnit(new Date(d)),
          v: null,
        })),
      );

      this.calendar.domainCollection.delete(
        backward ? domains.pop() : domains.shift(),
      );
    }

    domains = this.calendar.getDomainKeys();

    if (backward) {
      newDomains = newDomains.reverse();
    }

    this.calendar.calendarPainter.paint(direction);

    // getDatas(
    //   this.calendar,
    //   options,
    //   options.data,
    //   newDomains[0],
    //   generateSubDomain(
    //     newDomains[newDomains.length - 1],
    //     options,
    //     this.calendar.DTSDomain
    //   ).pop(),
    //   () => {
    //     this.calendar.fill(this.calendar.lastInsertedSvg);
    //   }
    // );

    this.#checkIfMinDomainIsReached(domains[0], domains[domains.length - 1]);
    this.#checkIfMaxDomainIsReached(this.#getNextDomain());

    if (direction === NAVIGATE_LEFT) {
      this.calendar.afterLoadPreviousDomain(newDomains[backward ? 0 : 1]);
    } else if (direction === NAVIGATE_RIGHT) {
      this.calendar.afterLoadNextDomain(domains[domains.length - 1]);
    }

    return {
      start: newDomains[backward ? 0 : 1],
      end: domains[domains.length - 1],
    };
  }

  #checkIfMinDomainIsReached(date, upperBound) {
    if (this.#minDomainIsReached(date)) {
      this.onMinDomainReached(true);
    }

    if (arguments.length === 2) {
      if (this.maxDomainReached && !this.#maxDomainIsReached(upperBound)) {
        this.onMaxDomainReached(false);
      }
    }
  }

  #checkIfMaxDomainIsReached(date, lowerBound) {
    if (this.#maxDomainIsReached(date)) {
      this.onMaxDomainReached(true);
    }

    if (arguments.length === 2) {
      if (this.minDomainReached && !this.#minDomainIsReached(lowerBound)) {
        this.onMinDomainReached(false);
      }
    }
  }

  /**
   * Get the n-th next domain after the calendar newest (rightmost) domain
   * @param  int n
   * @return Date The start date of the wanted domain
   */
  #getNextDomain(n = 1) {
    const { options } = this.calendar.options;

    return generateTimeInterval(
      options.domain,
      jumpDate(this.calendar.getDomainKeys().pop(), n, options.domain),
      n,
    )[0];
  }

  #setMinDomainReached(status) {
    this.minDomainReached = status;
  }

  #setMaxDomainReached(status) {
    this.maxDomainReached = status;
  }

  /**
   * Return whether a date is inside the scope determined by maxDate
   *
   * @param int datetimestamp The timestamp in ms to test
   * @return bool True if the specified date correspond to the calendar upper bound
   */
  #maxDomainIsReached(datetimestamp) {
    const { maxDate } = this.calendar.options.options;
    return maxDate?.getTime() < datetimestamp;
  }

  /**
   * Return whether a date is inside the scope determined by minDate
   *
   * @param int datetimestamp The timestamp in ms to test
   * @return bool True if the specified date correspond to the calendar lower bound
   */
  #minDomainIsReached(datetimestamp) {
    const { minDate } = this.calendar.options.options;

    return minDate?.getTime() >= datetimestamp;
  }
}
