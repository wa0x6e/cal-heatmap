const ALLOWED_DATA_TYPES = ['json', 'csv', 'tsv', 'txt'];

/**
 * Ensure that critical options are valid
 *
 * @throw {Error} on critical invalid options
 * @return {boolean} Returns true when there is not critical errors
 */
export default function validate(
  subDomainTemplate,
  { domain, subDomain, dataType },
) {
  if (!subDomainTemplate.has(domain)) {
    throw new Error(`'${domain}' is not a valid domain type'`);
  }

  if (!subDomainTemplate.has(subDomain)) {
    throw new Error(`'${subDomain}' is not a valid domain type'`);
  }

  if (
    subDomainTemplate.at(domain).level <= subDomainTemplate.at(subDomain).level
  ) {
    throw new Error(`'${subDomain}' is not a valid subDomain to '${domain}'`);
  }

  if (dataType && !ALLOWED_DATA_TYPES.includes(dataType)) {
    throw new Error(`The data type '${dataType}' is not valid data type`);
  }

  return true;
}
