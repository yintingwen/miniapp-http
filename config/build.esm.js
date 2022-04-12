import typescript from "@rollup/plugin-typescript"
import resolve from '@rollup/plugin-node-resolve'
import commonjs from "@rollup/plugin-commonjs"
import babel from "@rollup/plugin-babel"
import { terser } from "rollup-plugin-terser"

console.log(process.env.mode);

export default {
  input: './src/index.ts',
  output: {
    file: './dist/http.esm.js',
    format: 'esm'
  },
  plugins: [
    typescript()
  ]
}