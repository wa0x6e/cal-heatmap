import { SCROLL_FORWARD, SCROLL_BACKWARD } from '../constant';

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
      this.calendar.helpers.DateHelper.intervals(
        options.domain,
        this.calendar.domainCollection.max,
        typeof n === 'number' ? n + 1 : n,
      ).slice(1),
      SCROLL_FORWARD,
    );
  }

  loadPreviousDomain(n) {
    if (this.minDomainReached || n === 0) {
      return false;
    }

    const { options } = this.calendar.options;

    return this.loadNewDomains(
      this.calendar.helpers.DateHelper.intervals(
        options.domain,
        this.calendar.domainCollection.min,
        typeof n === 'number' ? -n : n,
      ),
      SCROLL_BACKWARD,
    );
  }

  jumpTo(date, reset) {
    const { domain } = this.calendar.options.options;
    const { domainCollection } = this.calendar;

    if (date < domainCollection.min) {
      return this.loadPreviousDomain(
        this.calendar.helpers.DateHelper.intervals(
          domain,
          date,
          domainCollection.min,
        ).length,
      );
    }
    if (reset) {
      return this.loadNextDomain(
        this.calendar.helpers.DateHelper.intervals(
          domain,
          domainCollection.min,
          date,
        ).length,
      );
    }

    if (date > domainCollection.max) {
      return this.loadNextDomain(
        this.calendar.helpers.DateHelper.intervals(
          domain,
          domainCollection.max,
          date,
        ).length,
      );
    }

    return false;
  }

  loadNewDomains(newDomains, direction = SCROLL_FORWARD) {
    const { options, minDate, maxDate } = this.calendar.options;
    const template = this.calendar.subDomainTemplate;
    const minDateInterval = minDate ?
      template.at(options.domain).extractUnit(minDate) :
      null;
    const maxDateInterval = maxDate ?
      template.at(options.domain).extractUnit(maxDate) :
      null;
    const { domainCollection } = this.calendar;

    // Removing out-of-bonds domains
    const boundedNewDomains = newDomains
      .filter(
        (i) => (minDateInterval ? i >= minDateInterval : true) &&
          (maxDateInterval ? i <= maxDateInterval : true),
      )
      .slice(-options.range);

    boundedNewDomains.forEach((domain, index) => {
      if (domainCollection.has(domain)) {
        return;
      }

      let subDomainEndDate = null;
      if (boundedNewDomains[index + 1]) {
        subDomainEndDate = boundedNewDomains[index + 1];
      } else {
        subDomainEndDate = this.calendar.helpers.DateHelper.intervals(
          options.domain,
          domain,
          2,
        ).pop();
      }

      domainCollection.set(
        domain,
        template
          .at(options.subDomain)
          .mapping(domain, subDomainEndDate - 1000, { v: null }),
      );

      domainCollection.trim(options.range, direction === SCROLL_FORWARD);
    });

    this.#checkDomainsBoundaryReached(
      domainCollection.min,
      domainCollection.max,
      minDateInterval,
      maxDateInterval,
    );

    if (direction === SCROLL_BACKWARD) {
      this.calendar.afterLoadPreviousDomain(domainCollection.min);
    } else if (direction === SCROLL_FORWARD) {
      this.calendar.afterLoadNextDomain(domainCollection.max);
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
