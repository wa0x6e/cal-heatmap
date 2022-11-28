import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';

export default {
  input: 'src/CalHeatmap.js',
  output: {
    file: 'dist/cal-heatmap.js',
    name: 'CalHeatmap',
    format: 'umd',
    external: [
      'd3-selection',
      'd3-format',
      'd3-time-format',
      'd3-transition',
      'd3-interpolate',
      'd3-scale',
      'd3-fetch',
    ],
  },
  plugins: [
    json(),
    commonjs(),
    resolve(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
};
