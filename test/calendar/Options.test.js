import Options from '../../src/calendar/Options';

describe('Options', () => {
  let options;
  let defaultValue;
  beforeEach(() => {
    options = new Options();
    defaultValue = options.options.data;
  });

  it('sets the new value', () => {
    expect(options.set('data', 'hello')).toEqual(true);
    expect(options.options.data).toEqual('hello');
  });

  it('ignores if setting an invalid key', () => {
    expect(options.set('test', 0)).toEqual(false);
    expect(options.options.data).toEqual(defaultValue);
  });

  it('ignores if setting a key with the same value', () => {
    expect(options.set('data', defaultValue)).toEqual(false);
    expect(options.options.data).toEqual(defaultValue);
  });
});
