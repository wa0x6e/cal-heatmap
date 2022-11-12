/**
 * Validate that a queryString is valid
 *
 * @param  {Element|string|bool} selector   The queryString to test
 * @param  {bool}  canBeFalse  Whether false is an accepted and valid value
 * @param  {string} name    Name of the tested selector
 * @throws {Error}        If the selector is not valid
 * @return {bool}        True if the selector is a valid queryString
 */
export function validateSelector(selector, canBeFalse, name) {
  if (
    ((canBeFalse && selector === false)
      || selector instanceof Element
      || typeof selector === 'string')
    && selector !== ''
  ) {
    return true;
  }
  throw new Error(`The ${name} is not valid`);
}

/**
 * Ensure that the domain and subdomain are valid
 *
 * @throw {Error} when domain or subdomain are not valid
 * @return {bool} True if domain and subdomain are valid and compatible
 */
export function validateDomainType(calendar, options) {
  if (
    !calendar.domainSkeleton.has(options.domain)
    || options.domain === 'min'
    || options.domain.substring(0, 2) === 'x_'
  ) {
    throw new Error(`The domain '${options.domain}' is not valid`);
  }

  if (
    !calendar.domainSkeleton.has(options.subDomain)
    || options.subDomain === 'year'
  ) {
    throw new Error(`The subDomain '${options.subDomain}' is not valid`);
  }

  if (
    calendar.domainSkeleton.at(options.domain).level
    <= calendar.domainSkeleton.at(options.subDomain).level
  ) {
    throw new Error(
      `'${
        options.subDomain
      }' is not a valid subDomain to '${
        options.domain
      }'`,
    );
  }

  return true;
}
