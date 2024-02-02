import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace'; // Import the plugin

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/cjs/index.js',
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: 'dist/esm/index.js',
                format: 'esm',
                sourcemap: true,
            },
        ],
        plugins: [
            resolve(),
            commonjs(),
            typescript({ tsconfig: './tsconfig.json' }),
            postcss({
                extensions: ['.css'],
                minimize: true,
                sourceMap: true,
                modules: true,
            }),
            json(),
            replace({
                'process.env.NODE_DEBUG': JSON.stringify(''), // Mock NODE_DEBUG or any other variables
                preventAssignment: true,
            }),
            // Add more replacements as needed
        ],
    },
    {
        input: 'dist/esm/types/index.d.ts',
        output: [{ file: 'dist/index.d.ts', format: 'esm' }],
        plugins: [dts()],
    },
];
