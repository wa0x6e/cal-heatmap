import { readFileSync } from 'fs';

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';
import scss from 'rollup-plugin-scss';
import typescript from '@rollup/plugin-typescript';

const pkg = JSON.parse(readFileSync('./package.json'));

const basePlugins = [
  typescript(),
  json(),
  commonjs(),
  resolve(),
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  filesize(),
  scss({ fileName: `${pkg.name}.css`, outputStyle: 'compressed' }),
];

const globals = {
  '@popperjs/core': 'Popper'
};

const exportConfig = (input, name, output, options = {}) => {
  return [
    {
      input,
      output: [
        {
          file: `dist/${output}.js`,
          name,
          format: 'umd',
          globals,
        },
      ],
      plugins: basePlugins,
      ...options
    },
    {
      input,
      watch: false,
      output: [
        {
          file: `dist/${output}.esm.js`,
          format: 'esm',
          globals,
        },
      ],
      plugins: basePlugins,
      ...options
    },
    {
      input,
      watch: false,
      output: [
        {
          compact: true,
          file: `dist/${output}.min.esm.js`,
          format: 'esm',
          sourcemap: true,
          globals,
        },
        {
          compact: true,
          file: `dist/${output}.min.js`,
          name,
          format: 'umd',
          sourcemap: true,
          globals,
        },
      ],
      plugins: [...basePlugins, terser()],
      ...options
    },
  ]
}

export default [
  ...exportConfig('src/CalHeatmap.ts', 'CalHeatmap', pkg.name),
  ...exportConfig('src/plugins/Tooltip.ts', 'Tooltip', 'plugins/Tooltip', { external: ['@popperjs/core'] }),
];
