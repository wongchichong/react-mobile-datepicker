import { defineConfig } from 'vite'
import path from 'path'
import dts from 'vite-plugin-dts'
import sassDts from 'vite-plugin-sass-dts'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const config = defineConfig({
    build: {
        minify: false,
        lib: {
            entry: ["./lib/index.tsx"],
            name: "voby-mobile-datepicker",
            formats: ['cjs', 'es', 'umd'],
            fileName: (format: string, entryName: string) => `${entryName}.${format}.js`
        },
        sourcemap: true,
    },
    esbuild: {
        jsx: 'automatic',
    },
    plugins: [
        dts({ entryRoot: './src', outputDir: './dist/types' })
    ],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
        },
    },
    css: {
        modules: {
            scopeBehaviour: 'global',
            localsConvention: 'camelCase',
        },
        preprocessorOptions: {
            sass: {
                "load-path": "./node_modules"
            }
        }
    },
})

export default config
