import DataFetcher from '../src/DataFetcher';
import Options from '../src/options/Options';
import CalHeatmap from '../src/CalHeatmap';

describe('DataFetcher', () => {
  const calendar = new CalHeatmap();

  describe('getDatas()', () => {
    it.todo('fetch the data from a remote source when string');
    it('returns the data itself when a JSON object', async () => {
      const fetcher = new DataFetcher(calendar);
      const data = [{ time: 1, value: 0 }];
      await expect(fetcher.getDatas(data, 0, 0)).resolves.toBe(data);
    });
    it('returns an empty object when source is not valid', async () => {
      const options = new Options();
      // @ts-ignore
      options.init({ data: { type: 'test', source: 'test' } });
      const fetcher = new DataFetcher(calendar);

      await expect(fetcher.getDatas('', 0, 0)).resolves.toStrictEqual([]);
    });

    it.todo('interpolates the url with the dates');
  });

  describe('parseURI()', () => {
    let fetcher: DataFetcher;
    beforeEach(() => {
      fetcher = new DataFetcher(calendar);
    });

    it('replaces the start token by a formatted date', () => {
      expect(
        fetcher.parseURI(
          'https://test.com/api?start={{start=[year]%20YYYY}}',
          +new Date('2020-01-01'),
          +new Date('2020-12-31'),
        ),
      ).toBe('https://test.com/api?start=year%202020');
    });

    it('replaces the end token by a formatted date', () => {
      expect(
        fetcher.parseURI(
          'https://test.com/api?start={{end=x}}',
          +new Date('2020-01-01'),
          +new Date('2020-12-31'),
        ),
      ).toBe(`https://test.com/api?start=${+new Date('2020-12-31')}`);
    });

    it('replaces both the start and the end token by a formatted date', () => {
      expect(
        fetcher.parseURI(
          'https://test.com/api?start={{start=x}}&end={{end=x}}',
          +new Date('2020-01-01'),
          +new Date('2020-12-31'),
        ),
      ).toBe(
        `https://test.com/api?start=${+new Date('2020-01-01')}&end=${+new Date(
          '2020-12-31',
        )}`,
      );
    });
  });
});
