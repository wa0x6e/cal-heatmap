import { SCROLL_FORWARD, SCROLL_BACKWARD } from '../constant';

export default class Navigator {
  constructor(calendar) {
    this.calendar = calendar;
    this.maxDomainReached = false;
    this.minDomainReached = false;
  }

  loadNewDomains(newDomainCollection, direction = SCROLL_FORWARD) {
    const { options } = this.calendar.options;
    const template = this.calendar.subDomainTemplate;
    const minDate = options.minDate ?
      template.at(options.domain).extractUnit(options.minDate) :
      null;
    const maxDate = options.maxDate ?
      template.at(options.domain).extractUnit(options.maxDate) :
      null;
    const { domainCollection } = this.calendar;

    if (
      this.#isDomainBoundaryReached(
        newDomainCollection,
        minDate,
        maxDate,
        direction,
      )
    ) {
      return false;
    }

    newDomainCollection
      .clamp(minDate, maxDate)
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

    this.#setDomainsBoundaryReached(
      domainCollection.min,
      domainCollection.max,
      minDate,
      maxDate,
    );

    if (direction === SCROLL_BACKWARD) {
      this.calendar.afterLoadPreviousDomain(domainCollection.min);
    } else if (direction === SCROLL_FORWARD) {
      this.calendar.afterLoadNextDomain(domainCollection.max);
    }

    return direction;
  }

  jumpTo(date, reset) {
    const { domainCollection } = this.calendar;
    const minDate = new Date(domainCollection.min);
    const maxDate = new Date(domainCollection.max);

    if (date < minDate) {
      return this.loadNewDomains(
        this.calendar.createDomainCollection(date, minDate),
        SCROLL_BACKWARD,
      );
    }
    if (reset) {
      return this.loadNewDomains(
        this.calendar.createDomainCollection(
          date,
          this.calendar.options.options.range,
        ),
        SCROLL_BACKWARD,
      );
    }

    if (date > maxDate) {
      return this.loadNewDomains(
        this.calendar.createDomainCollection(maxDate, date),
        SCROLL_FORWARD,
      );
    }

    return false;
  }

  #isDomainBoundaryReached(newDomainCollection, minDate, maxDate, direction) {
    if (
      newDomainCollection.max >= maxDate &&
      this.maxDomainReached &&
      direction === SCROLL_FORWARD
    ) {
      return true;
    }

    if (
      newDomainCollection.min <= minDate &&
      this.minDomainReached &&
      direction === SCROLL_BACKWARD
    ) {
      return true;
    }

    return false;
  }

  #setDomainsBoundaryReached(lowerBound, upperBound, min, max) {
    if (min) {
      this.minDomainReached = lowerBound <= min;
    }
    if (max) {
      this.maxDomainReached = upperBound >= max;
    }
  }
}
