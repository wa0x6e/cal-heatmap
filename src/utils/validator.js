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
    ((canBeFalse && selector === false) ||
      selector instanceof Element ||
      typeof selector === 'string') &&
    selector !== ''
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
export function validateDomainType(subDomainTemplate, { domain, subDomain }) {
  if (
    !subDomainTemplate.has(domain) ||
    domain === 'min' ||
    domain.substring(0, 2) === 'x_'
  ) {
    throw new Error(`The domain '${domain}' is not valid`);
  }

  if (!subDomainTemplate.has(subDomain) || subDomain === 'year') {
    throw new Error(`The subDomain '${subDomain}' is not valid`);
  }

  if (
    subDomainTemplate.at(domain).level <= subDomainTemplate.at(subDomain).level
  ) {
    throw new Error(`'${subDomain}' is not a valid subDomain to '${domain}'`);
  }

  return true;
}
