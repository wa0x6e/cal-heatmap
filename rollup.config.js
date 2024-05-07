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

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url)),
);

const external = Object.keys(pkg.dependencies);

let basePlugins = [
  typescript({ declaration: false }),
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

const exportConfig = (input, output) => {
  return [
    {
      input,
      watch: false,
      output: [
        {
          file: `dist/${output}.js`,
          format: 'esm',
        },
        {
          file: `dist/${output}.cjs`,
          format: 'cjs',
        },
      ],
      external,
      plugins: [...basePlugins, terser()],
    },
  ];
};

export default [...exportConfig('src/index.ts', pkg.name)];
