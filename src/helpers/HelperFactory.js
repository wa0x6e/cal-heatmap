import DateHelper from './DateHelper';

export default function createHelpers(calendar) {
  const { locale, timezone } = calendar.options.options.date;
  return {
    DateHelper: new DateHelper(locale, timezone),
  };
}
