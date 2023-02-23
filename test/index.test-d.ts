import { expectType } from 'tsd';
import type dayjs from 'dayjs';
import type { PluginFunc } from 'dayjs';

import CalHeatmap from '../src/CalHeatmap';

const cal = new CalHeatmap();

expectType<CalHeatmap>(cal);
expectType<Promise<unknown>>(cal.paint());
expectType<Promise<unknown>>(cal.paint({}));
expectType<Promise<unknown>>(cal.paint({ range: 3 }));
expectType<Promise<unknown>>(cal.paint({}, []));

expectType<Promise<unknown>>(cal.next());
expectType<Promise<unknown>>(cal.next(1));

expectType<Promise<unknown>>(cal.previous());
expectType<Promise<unknown>>(cal.previous(1));

expectType<Promise<unknown>>(cal.jumpTo(new Date()));

expectType<Promise<unknown>>(cal.fill());
expectType<Promise<unknown>>(cal.fill(''));
expectType<Promise<unknown>>(cal.fill([]));

expectType<Promise<unknown>>(cal.destroy());

expectType<CalHeatmap.Dimensions>(cal.dimensions());

expectType<void>(cal.on('eventName', () => {}));

expectType<void>(cal.addTemplates({} as CalHeatmap.Template));

expectType<dayjs.Dayjs>(cal.extendDayjs((): PluginFunc => () => {}));
