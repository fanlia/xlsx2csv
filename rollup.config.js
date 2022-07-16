import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: './index.browser.js',
  output: {
    format: 'umd',
    name: 'xlsx2csv',
    file: 'xlsx2csv.min.js',
    compact: true,
  },
  plugins: [
      commonjs(),
      nodeResolve({
        browser: true,
      }),
  ]
};
