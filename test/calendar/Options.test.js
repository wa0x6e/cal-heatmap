import Options from '../../src/calendar/Options';

describe('set()', () => {
  let options;
  let defaultValue;
  beforeEach(() => {
    options = new Options();
    defaultValue = options.options.data;
  });

  it('set the new value', () => {
    expect(options.set('data', 'hello')).toEqual(true);
    expect(options.options.data).toEqual('hello');
  });

  it('ignores if key is not valid', () => {
    expect(options.set('test', 0)).toEqual(false);
    expect(options.options.data).toEqual(defaultValue);
  });

  it('ignores if value is the same', () => {
    expect(options.set('data', defaultValue)).toEqual(false);
    expect(options.options.data).toEqual(defaultValue);
  });
});
