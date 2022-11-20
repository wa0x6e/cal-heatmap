import { generateSubDomain } from '../subDomain/subDomainGenerator';

export default class CalendarEvent {
  constructor() {
    this.statusComplete = false;
  }

  /**
   * Helper method for triggering event callback
   *
   * @param  string  eventName       Name of the event to trigger
   * @param  array  successArgs     List of argument to pass to the callback
   * @param  boolean  skip      Whether to skip the event triggering
   * @return mixed  True when the triggering was skipped, false on error, else the callback function
   */
  #triggerEvent(eventName, successArgs, skip = false) {
    if (skip || !this.options.options[eventName]) {
      return true;
    }

    if (typeof this.options.options[eventName] === 'function') {
      if (typeof successArgs === 'function') {
        successArgs = successArgs();
      }
      return this.options.options[eventName].apply(this, successArgs);
    }
    console.log(`Provided callback for ${eventName} is not a function.`);
    return false;
  }

  /**
   * Event triggered on a mouse click on a subDomain cell
   *
   * @param  Date    d    Date of the subdomain block
   * @param  int    itemNb  Number of items in that date
   */
  onClick(...args) {
    return this.#triggerEvent('onClick', [...args]);
  }

  /**
   * Event triggered when the mouse cursor enteres a subDomain cell
   *
   * @param  Date    d    Date of the subdomain block
   * @param  int    itemNb  Number of items in that date
   */
  onMouseOver(...args) {
    return this.#triggerEvent('onMouseOver', [...args]);
  }

  /**
   * Event triggered when the mouse cursor leaves a subDomain cell
   *
   * @param  Date    d    Date of the subdomain block
   * @param  int    itemNb  Number of items in that date
   */
  onMouseOut(...args) {
    return this.#triggerEvent('onMouseOut', [...args]);
  }

  /**
   * Event triggered after drawing the calendar, but before filling it with data
   */
  afterLoad() {
    return this.#triggerEvent('afterLoad');
  }

  /**
   * Event triggered after completing drawing and filling the calendar
   */
  onComplete() {
    const response = this.#triggerEvent('onComplete', [], this.statusComplete);
    this.statusComplete = true;
    return response;
  }

  /**
   * Event triggered after resize event
   */
  onResize(h, w) {
    return this.#triggerEvent('onResize', [h, w]);
  }

  /**
   * Event triggered after shifting the calendar one domain back
   *
   * @param  Date    start  Domain start date
   * @param  Date    end    Domain end date
   */
  afterLoadPreviousDomain(start) {
    return this.#triggerEvent('afterLoadPreviousDomain', () => {
      const subDomain = generateSubDomain(
        this.calendar,
        start,
        this.options.options,
        this.DTSDomain,
      );
      return [subDomain.shift(), subDomain.pop()];
    });
  }

  /**
   * Event triggered after shifting the calendar one domain above
   *
   * @param  Date    start  Domain start date
   * @param  Date    end    Domain end date
   */
  afterLoadNextDomain(start) {
    return this.#triggerEvent('afterLoadNextDomain', () => {
      const subDomain = generateSubDomain(
        this.calendar,
        start,
        this.options.options,
        this.DTSDomain,
      );
      return [subDomain.shift(), subDomain.pop()];
    });
  }

  /**
   * Event triggered after loading the leftmost domain allowed by minDate
   *
   * @param  boolean  reached True if the leftmost domain was reached
   */
  onMinDomainReached(reached) {
    this.navigator.minDomainReached = reached;
    return this.#triggerEvent('onMinDomainReached', [reached]);
  }

  /**
   * Event triggered after loading the rightmost domain allowed by maxDate
   *
   * @param  boolean  reached True if the rightmost domain was reached
   */
  onMaxDomainReached(reached) {
    this.navigator.maxDomainReached = reached;
    return this.#triggerEvent('onMaxDomainReached', [reached]);
  }

  afterUpdate() {
    return this.#triggerEvent('afterUpdate');
  }
}
