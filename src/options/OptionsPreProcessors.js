import {
  castArray, isFunction, isString, isNumber,
} from 'lodash-es';

export default {
  range: (value) => Math.max(+value, 1),
  highlight: (args) => castArray(args),
  itemName: (name) => {
    if (isString(name)) {
      return [name, name + (name !== '' ? 's' : '')];
    }

    if (Array.isArray(name)) {
      if (name.length === 1) {
        return [name[0], `${name[0]}s`];
      }
      if (name.length > 2) {
        return name.slice(0, 2);
      }
    }
    return name;
  },
  cellSize: (value) => {
    if (isNumber(value)) {
      return [value, value];
    }

    return value;
  },
  domainMargin: (settings) => {
    let value = settings;
    if (isNumber(value)) {
      value = [value];
    }

    if (!Array.isArray(value) || !value.every((d) => isNumber(d))) {
      // eslint-disable-next-line no-console
      console.log('Margin only accepts an integer or an array of integers');
      value = [0];
    }

    switch (value.length) {
      case 1:
        return [value[0], value[0], value[0], value[0]];
      case 2:
        return [value[0], value[1], value[0], value[1]];
      case 3:
        return [value[0], value[1], value[2], value[1]];
      default:
        return value.slice(0, 4);
    }
  },
  'formatter.subDomainLabel': (value) =>
    // eslint-disable-next-line
    ((isString(value) && value !== '') || isFunction(value) ? value : null),
};
