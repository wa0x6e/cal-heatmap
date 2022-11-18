import { NAVIGATE_RIGHT, NAVIGATE_LEFT } from '../constant';
import { generateTimeInterval, getTimeInterval } from '../utils/timeInterval';
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
    const domainsBound = this.calendar.getDomainBoundKeys();
    const { domain } = this.calendar.options.options;

    if (date < domainsBound.min) {
      return this.loadPreviousDomain(
        generateTimeInterval(domain, date, domainsBound.min).length,
      );
    }
    if (reset) {
      return this.loadNextDomain(
        generateTimeInterval(domain, domainsBound.min, date).length,
      );
    }

    if (date > domainsBound.max) {
      return this.loadNextDomain(
        generateTimeInterval(domain, domainsBound.max, date).length,
      );
    }

    return false;
  }

  loadNewDomains(newDomains, direction = NAVIGATE_RIGHT) {
    const backward = direction === NAVIGATE_LEFT;
    const { options, minDate, maxDate } = this.calendar.options;
    const minDateInterval = minDate ? getTimeInterval(minDate) : null;
    const maxDateInterval = maxDate ? getTimeInterval(maxDate) : null;
    const domains = this.calendar.getDomainKeys();

    // Removing out-of-bonds domains
    const boundedNewDomains = newDomains
      .filter(
        (i) =>
          (minDateInterval ? i >= minDateInterval : true) &&
          (maxDateInterval ? i <= maxDateInterval : true),
      )
      .slice(-options.range);

    boundedNewDomains.forEach((domain) => {
      if (this.calendar.domainCollection.has(domain)) {
        return;
      }

      this.calendar.domainCollection.set(
        domain,
        generateSubDomain(domain, options).map((d) => ({
          t: this.calendar.subDomainTemplate
            .at(options.subDomain)
            .extractUnit(d),
          v: null,
        })),
      );

      this.calendar.domainCollection.delete(
        backward ? domains.pop() : domains.shift(),
      );
    });

    const domainsBound = this.calendar.getDomainBoundKeys();

    this.#checkDomainsBoundaryReached(
      domainsBound.min,
      domainsBound.max,
      minDateInterval,
      maxDateInterval,
    );

    if (direction === NAVIGATE_LEFT) {
      this.calendar.afterLoadPreviousDomain(domainsBound.min);
    } else if (direction === NAVIGATE_RIGHT) {
      this.calendar.afterLoadNextDomain(domainsBound.max);
    }

    return direction;
  }

  #checkDomainsBoundaryReached(lowerBound, upperBound, min, max) {
    if (min) {
      this.minDomainReached = lowerBound <= min;
    }
    if (max) {
      this.maxDomainReached = upperBound >= max;
    }
  }
}
