import eslint from '@rollup/plugin-eslint';
import globals from 'rollup-plugin-node-globals';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
// import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import sizes from 'rollup-plugin-sizes';
// import del from 'rollup-plugin-delete';
import autoExternal from 'rollup-plugin-auto-external';
import { camelCase } from 'lodash';

const pkg = require('./package.json');

const libraryName = 'node-buffs';

// eslint-disable-next-line import/no-default-export
export default {
  input: `src/${libraryName}.ts`,
  output: [
    // { file: pkg.main, name: camelCase(libraryName), format: 'umd', sourcemap: true },
    // { file: pkg.module, format: 'es', sourcemap: true },
    { file: pkg.main, name: camelCase(libraryName), format: 'umd', sourcemap: true },
    { file: pkg.module, format: 'cjs', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  // external: ['lodash', 'dotenv', 'crypto', 'path', 'js-yaml', 'fs'],
  watch: {
    include: 'src/**',
  },
  plugins: [
    eslint({ fix: false }),
    // del({ targets: 'dist/*' }),
    // Allow json resolution
    json(),
    globals(),
    autoExternal(),
    // builtins({ crypto: true }),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
    sizes({ details: true }),
  ],
};
