import DataFetcher from '../src/DataFetcher';
import Options from '../src/options/Options';

describe('DataFetcher', () => {
  describe('getDatas', () => {
    it.todo('fetch the data from a remote source when string');
    it('returns the data itself when a JSON object', async () => {
      const fetcher = new DataFetcher(new Options());
      const data = [{ time: 1, value: 0 }];
      await expect(fetcher.getDatas(data, 0, 0)).resolves.toBe(data);
    });
    it.todo('returns an empty object when source is not valid');

    it.todo('interpolate the url with the dates');
  });
});
