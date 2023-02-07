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
    it('returns an empty object when source is not valid', async () => {
      const options = new Options();
      // @ts-ignore
      options.init({ data: { type: 'test', source: 'test' } });
      const fetcher = new DataFetcher(options);

      await expect(fetcher.getDatas('', 0, 0)).resolves.toStrictEqual([]);
    });

    it.todo('interpolate the url with the dates');
  });
});
