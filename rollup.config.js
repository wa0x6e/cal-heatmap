import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/cal-heatmap.js',
  output: {
    file: 'dist/cal-heatmap.js',
    name: 'CalHeatMap',
    format: 'umd',
    external: [
      'd3-selection',
      'd3-format',
      'd3-time',
      'd3-time-format',
      'd3-transition',
      'd3-interpolate',
      'd3-scale',
      'd3-fetch',
    ],
  },
  plugins: [resolve()],
};
