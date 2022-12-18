import { readFileSync } from 'fs';

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';
import scss from 'rollup-plugin-scss';

const pkg = JSON.parse(readFileSync('./package.json'));

const basePlugins = [
  json(),
  commonjs(),
  resolve(),
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  filesize(),
  scss({ output: `dist/${pkg.name}.css`, outputStyle: 'compressed' }),
];

export default [
  {
    input: 'build-tsc/CalHeatmap.js',
    output: [
      {
        file: `dist/${pkg.name}.js`,
        name: 'CalHeatmap',
        format: 'umd',
      },
    ],
    plugins: basePlugins,
  },
  {
    input: 'build-tsc/CalHeatmap.js',
    watch: false,
    output: [
      {
        file: `dist/${pkg.name}.esm.js`,
        format: 'esm',
      },
    ],
    plugins: basePlugins,
  },
  {
    input: 'build-tsc/CalHeatmap.js',
    watch: false,
    output: [
      {
        compact: true,
        file: `dist/${pkg.name}.min.esm.js`,
        format: 'esm',
        sourcemap: true,
      },
      {
        compact: true,
        file: `dist/${pkg.name}.min.js`,
        name: 'CalHeatmap',
        format: 'umd',
        sourcemap: true,
      },
    ],
    plugins: [...basePlugins, terser()],
  },
];
