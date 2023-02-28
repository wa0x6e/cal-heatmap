import type TemplateCollection from '../TemplateCollection';
import type { DomainOptions, SubDomainOptions, DataOptions } from './Options';
import type { DomainType } from '../index';

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
  const domainType = domain.type as DomainType;
  const subDomainType = subDomain.type as string;

  if (!templateCollection.has(domainType)) {
    throw new Error(`'${domainType}' is not a valid domain type'`);
  }

  if (!templateCollection.has(subDomainType)) {
    throw new Error(`'${subDomainType}' is not a valid subDomain type'`);
  }

  if (data.type && !ALLOWED_DATA_TYPES.includes(data.type)) {
    throw new Error(`The data type '${data.type}' is not valid data type`);
  }

  if (
    !(templateCollection.get(subDomainType).allowedDomainType || []).includes(
      domainType,
    )
  ) {
    throw new Error(
      `The subDomain.type '${subDomainType}' can not be used together ` +
        `with the domain type ${domainType}`,
    );
  }

  return true;
}
