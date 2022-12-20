import DateHelper from './DateHelper';
import type Options from '../options/Options';

export type Helpers = {
  DateHelper: DateHelper;
};

export default function createHelpers(options: Options) {
  const { locale, timezone } = options.options.date;
  return {
    DateHelper: new DateHelper(locale, timezone),
  };
}
