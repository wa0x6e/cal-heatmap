import { NAVIGATE_RIGHT, NAVIGATE_LEFT } from '../constant';

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
      this.calendar.helpers.DateHelper.generateTimeInterval(
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
      this.calendar.helpers.DateHelper.generateTimeInterval(
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
        this.calendar.helpers.DateHelper.generateTimeInterval(
          domain,
          date,
          domainsBound.min,
        ).length,
      );
    }
    if (reset) {
      return this.loadNextDomain(
        this.calendar.helpers.DateHelper.generateTimeInterval(
          domain,
          domainsBound.min,
          date,
        ).length,
      );
    }

    if (date > domainsBound.max) {
      return this.loadNextDomain(
        this.calendar.helpers.DateHelper.generateTimeInterval(
          domain,
          domainsBound.max,
          date,
        ).length,
      );
    }

    return false;
  }

  loadNewDomains(newDomains, direction = NAVIGATE_RIGHT) {
    const backward = direction === NAVIGATE_LEFT;
    const { options, minDate, maxDate } = this.calendar.options;
    const template = this.calendar.subDomainTemplate;
    const minDateInterval = minDate
      ? template.at(options.domain).extractUnit(minDate)
      : null;
    const maxDateInterval = maxDate
      ? template.at(options.domain).extractUnit(maxDate)
      : null;
    const domains = this.calendar.getDomainKeys();

    // Removing out-of-bonds domains
    const boundedNewDomains = newDomains
      .filter(
        (i) =>
          (minDateInterval ? i >= minDateInterval : true) &&
          (maxDateInterval ? i <= maxDateInterval : true),
      )
      .slice(-options.range);

    boundedNewDomains.forEach((domain, index) => {
      if (this.calendar.domainCollection.has(domain)) {
        return;
      }

      let subDomainEndDate = null;
      if (boundedNewDomains[index + 1]) {
        subDomainEndDate = boundedNewDomains[index + 1];
      } else {
        subDomainEndDate =
          this.calendar.helpers.DateHelper.generateTimeInterval(
            options.domain,
            domain,
            2,
          ).pop();
      }

      this.calendar.domainCollection.set(
        domain,
        template
          .at(options.subDomain)
          .mapping(domain, subDomainEndDate - 1000, { v: null }),
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
