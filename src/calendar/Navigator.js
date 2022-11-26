import { SCROLL_FORWARD, SCROLL_BACKWARD } from '../constant';

export default class Navigator {
  constructor(calendar) {
    this.calendar = calendar;
    this.maxDomainReached = false;
    this.minDomainReached = false;
  }

  loadNextDomain(newDomainCollection) {
    if (this.maxDomainReached) {
      return false;
    }

    return this.loadNewDomains(newDomainCollection, SCROLL_FORWARD);
  }

  loadPreviousDomain(newDomainCollection) {
    if (this.minDomainReached) {
      return false;
    }

    return this.loadNewDomains(newDomainCollection, SCROLL_BACKWARD);
  }

  jumpTo(date, reset) {
    const { domainCollection } = this.calendar;
    const minDate = new Date(domainCollection.min);
    const maxDate = new Date(domainCollection.max);

    if (date < minDate) {
      return this.loadPreviousDomain(
        this.calendar.createDomainCollection(date, minDate),
      );
    }
    if (reset) {
      return this.loadNextDomain(
        this.calendar.createDomainCollection(minDate, date),
      );
    }

    if (date > maxDate) {
      return this.loadNextDomain(
        this.calendar.createDomainCollection(maxDate, date),
      );
    }

    return false;
  }

  loadNewDomains(newDomainCollection, direction = SCROLL_FORWARD) {
    const { options, minDate, maxDate } = this.calendar.options;
    const template = this.calendar.subDomainTemplate;
    const minDateInterval = minDate ?
      template.at(options.domain).extractUnit(minDate) :
      null;
    const maxDateInterval = maxDate ?
      template.at(options.domain).extractUnit(maxDate) :
      null;
    const { domainCollection } = this.calendar;

    newDomainCollection
      .clamp(minDateInterval, maxDateInterval)
      .slice(options.range, direction === SCROLL_FORWARD);

    domainCollection.merge(
      newDomainCollection,
      options.range,
      (domain, index) => {
        let subDomainEndDate = null;
        if (newDomainCollection.at(index + 1)) {
          subDomainEndDate = newDomainCollection.at(index + 1);
        } else {
          subDomainEndDate = this.calendar.helpers.DateHelper.intervals(
            options.domain,
            domain,
            2,
          ).pop();
        }
        return template
          .at(options.subDomain)
          .mapping(domain, subDomainEndDate - 1000, { v: null });
      },
    );

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
