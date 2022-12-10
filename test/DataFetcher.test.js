import DataFetcher from '../src/DataFetcher';

describe('DataFetcher', () => {
  describe('getDatas', () => {
    it.todo('fetch the data from a remote source when string');
    it('returns the data itself when a JSON object', async () => {
      const fetcher = new DataFetcher({});
      const data = { 1: 0 };
      await expect(fetcher.getDatas(data)).resolves.toBe(data);
    });
    it.todo('returns an empty object when source is not valid');

    it.todo('interpolate the url with the dates');
  });
});
