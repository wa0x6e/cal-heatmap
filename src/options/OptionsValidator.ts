import type TemplateCollection from '../calendar/TemplateCollection';
import type { DomainOptions, SubDomainOptions, DataOptions } from './Options';

const ALLOWED_DATA_TYPES = ['json', 'csv', 'tsv', 'txt'];

/**
 * Ensure that critical options are valid
 *
 * @throw {Error} on critical invalid options
 * @return {boolean} Returns true when there is not critical errors
 */
export default function validate(
  templateCollection: TemplateCollection,
  {
    domain,
    subDomain,
    data,
  }: {
    domain: Partial<DomainOptions>;
    subDomain: Partial<SubDomainOptions>;
    data: Partial<DataOptions>;
  },
): boolean {
  const domainType = <string>domain.type;
  const subDomainType = <string>subDomain.type;

  if (!templateCollection.has(domainType)) {
    throw new Error(`'${domainType}' is not a valid domain type'`);
  }

  if (!templateCollection.has(subDomainType)) {
    throw new Error(`'${subDomainType}' is not a valid domain type'`);
  }

  if (
    templateCollection.at(domainType).level <=
    templateCollection.at(subDomainType).level
  ) {
    throw new Error(
      `'${subDomainType}' is not a valid subDomain to '${domainType}'`,
    );
  }

  if (data.type && !ALLOWED_DATA_TYPES.includes(data.type)) {
    throw new Error(`The data type '${data.type}' is not valid data type`);
  }

  return true;
}
