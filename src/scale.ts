// @ts-ignore
import { scale } from '@observablehq/plot';
import { OptionsType } from './options/Options';
import { SCALE_BASE_OPACITY_COLOR } from './constant';

export function normalizedScale(scaleOptions: OptionsType['scale']): any {
  try {
    const scaleType = Object.keys(scaleOptions!)[0];

    return scale({
      [scaleType]: {
        ...scaleOptions![scaleType as 'color' | 'opacity'],
        clamp: true,
      },
    });
  } catch (error) {
    return null;
  }
}

function scaleStyle(_scale: any, scaleOptions: OptionsType['scale']) {
  const styles: { fill?: Function; 'fill-opacity'?: Function } = {};

  if (scaleOptions!.hasOwnProperty('opacity')) {
    styles.fill = () =>
      // eslint-disable-next-line implicit-arrow-linebreak
      scaleOptions!.opacity!.baseColor || SCALE_BASE_OPACITY_COLOR;
    styles['fill-opacity'] = (d: any) => _scale?.apply(d);
  } else {
    styles.fill = (d: any) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      (typeof d === 'string' && d?.startsWith('#') ? d : _scale?.apply(d));
  }

  return styles;
}

export function applyScaleStyle(
  elem: any,
  _scale: any,
  scaleOptions: OptionsType['scale'],
  keyname?: string,
) {
  Object.entries(scaleStyle(_scale, scaleOptions)).forEach(([prop, val]) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    elem.style(prop, (d: any) => val(keyname ? d[keyname] : d)));
}
