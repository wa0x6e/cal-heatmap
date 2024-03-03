import { readFileSync, writeFileSync } from 'fs';

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';
import autoprefixer from 'autoprefixer';
import postcss from 'rollup-plugin-postcss';
import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';

const pkg = JSON.parse(readFileSync('./package.json'));

let basePlugins = [
  typescript(),
  json(),
  commonjs(),
  resolve(),
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  filesize(),
];

const productionPlugins = [
  babel({ babelHelpers: 'bundled', extensions: ['.ts'] }),
  postcss({
    extract: `${pkg.name}.css`,
    minimize: true,
    plugins: [autoprefixer],
  }),
];

if (!process.env.ROLLUP_WATCH) {
  basePlugins = basePlugins.concat(productionPlugins);
} else {
  basePlugins.push(
    postcss({
      extract: `${pkg.name}.css`,
    }),
  );
}

writeFileSync(
  './src/version.ts',
  `const VERSION = '${pkg.version.replace(
    /^v/,
    '',
  )}';\nexport default VERSION;\n`,
);

const globals = {
  'd3-selection': 'd3',
  d3: 'd3',
  'd3-color': 'd3',
  'd3-fetch': 'd3',
  'd3-transition': 'd3',
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
      ...options,
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
      ...options,
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
      ...options,
    },
  ];
};

export default [
  ...exportConfig('src/index.ts', 'CalHeatmap', pkg.name, {
    external: [
      'd3',
      'd3-color',
      'd3-fetch',
      'd3-format',
      'd3-scale',
      'd3-selection',
      'd3-transition',
    ],
  })
];
