import locale_fr from 'dayjs/locale/fr';

window.dayjs_locale_fr = locale_fr;

/* eslint-disable arrow-body-style */
const data = {
  title: 'Options: date',
  tests: [
    {
      title: 'starts the calendar with the given date',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { type: 'month' },
          subDomain: {
            type: 'day',
            label: (ts) => new Date(ts).toISOString(),
          },
          date: { start: new Date('2020-07-15T02:06'), timezone: 'utc' },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select(d3.select('.ch-subdomain-text').nodes()[0]).html();
          },
          expected: () => new Date('2020-07-01T00:00Z').toISOString(),
        },
      ],
    },
    {
      title: 'sets the calendar locale',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { type: 'month' },
          subDomain: {
            type: 'day',
            label: (ts) => new Date(ts).toISOString(),
          },
          date: {
            start: new Date('2020-01-15T02:06'),
            locale: 'fr',
            timezone: 'utc',
          },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3.select('.ch-domain-text').html();
          },
          expected: () => 'janvier',
        },
      ],
    },
    {
      title: 'extends the EN locale',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { type: 'week' },
          subDomain: {
            type: 'day',
            label: 'ddd',
          },
          date: {
            start: new Date('2020-01-15T02:06'),
            timezone: 'utc',
            locale: { weekStart: 1 },
          },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select('.ch-subdomain-container  g:nth-child(1) text')
              .html();
          },
          expected: () => 'Mon',
        },
      ],
    },
    {
      title: 'uses a custom locale',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { type: 'week' },
          subDomain: {
            type: 'day',
            label: 'ddd',
          },
          date: {
            start: new Date('2020-01-15T02:06'),
            timezone: 'utc',
            locale: {
              name: 'es-custom',
              monthsShort:
                'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_'),
              weekdays:
                'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split(
                  '_',
                ),
              weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
              weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
              months:
                // eslint-disable-next-line max-len
                'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split(
                  '_',
                ),
              weekStart: 1,
              formats: {
                LT: 'H:mm',
                LTS: 'H:mm:ss',
                L: 'DD/MM/YYYY',
                LL: 'D [de] MMMM [de] YYYY',
                LLL: 'D [de] MMMM [de] YYYY H:mm',
                LLLL: 'dddd, D [de] MMMM [de] YYYY H:mm',
              },
              relativeTime: {
                future: 'en %s',
                past: 'hace %s',
                s: 'unos segundos',
                m: 'un minuto',
                mm: '%d minutos',
                h: 'una hora',
                hh: '%d horas',
                d: 'un día',
                dd: '%d días',
                M: 'un mes',
                MM: '%d meses',
                y: 'un año',
                yy: '%d años',
              },
              ordinal: (n) => `${n}º`,
            },
          },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select('.ch-subdomain-container  g:nth-child(1) text')
              .html();
          },
          expected: () => 'lun.',
        },
      ],
    },
    {
      title: 'highlight the given dates',
      setup: (cal) => {
        return cal.paint({
          range: 1,
          domain: { type: 'month' },
          subDomain: {
            type: 'day',
            label: (ts) => new Date(ts).toISOString(),
          },
          date: {
            start: new Date('2020-01-15T02:06'),
            highlight: [new Date('2020-01-15'), new Date('2020-01-25')],
            timezone: 'utc',
          },
        });
      },
      expectations: [
        {
          current: (d3) => {
            return d3
              .select('.ch-subdomain-container  g:nth-child(15) rect')
              .attr('class');
          },
          expectedContain: () => 'highlight',
        },
        {
          current: (d3) => {
            return d3
              .select('.ch-subdomain-container  g:nth-child(25) rect')
              .attr('class');
          },
          expectedContain: () => 'highlight',
        },
      ],
    },
  ],
};

export default data;
