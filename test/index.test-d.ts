import { expectType, expectError } from 'tsd';
import type dayjs from 'dayjs';
import type { PluginFunc } from 'dayjs';

import CalHeatmap from '../src/CalHeatmap';

const cal = new CalHeatmap();

expectType<CalHeatmap>(cal);
expectType<Promise<unknown>>(cal.paint());
expectType<Promise<unknown>>(cal.paint({}));
expectType<Promise<unknown>>(cal.paint({ range: 3 }));
expectType<Promise<unknown>>(cal.paint({}, []));

expectError(cal.paint(''));
expectError(cal.paint(null));
expectError(cal.paint({ unknown: 'hello' }));
expectError(cal.paint({}, ['name', {}]));
expectError(cal.paint({}, [['name', {}]]));

expectType<Promise<unknown>>(cal.next());
expectType<Promise<unknown>>(cal.next(1));
expectError(cal.next('hello'));

expectType<Promise<unknown>>(cal.previous());
expectType<Promise<unknown>>(cal.previous(1));
expectError(cal.previous('hello'));

expectType<Promise<unknown>>(cal.jumpTo(new Date()));
expectError(cal.jumpTo());
expectError(cal.jumpTo(1));
expectError(cal.jumpTo(''));

expectType<Promise<unknown>>(cal.fill());
expectType<Promise<unknown>>(cal.fill(''));
expectType<Promise<unknown>>(cal.fill([]));
expectError(cal.fill({}));

expectType<Promise<unknown>>(cal.destroy());

expectType<CalHeatmap.Dimensions>(cal.dimensions());

expectType<void>(cal.on('eventName', () => {}));
expectError(cal.on());
expectError(cal.on('eventName'));
expectError(cal.on('eventName', 'string'));

expectType<void>(cal.addTemplates({} as CalHeatmap.Template));
expectError(cal.addTemplates());

expectType<dayjs.Dayjs>(cal.extendDayjs((): PluginFunc => () => {}));
expectError(cal.extendDayjs());
expectError(cal.extendDayjs(''));
