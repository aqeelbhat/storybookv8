import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss"; // postcss has been removed from v7 and up
import images from "@rollup/plugin-image";
import json from "@rollup/plugin-json";
import copy from "rollup-plugin-copy";

import packageJson from "./package.json" assert { type: "json" };

export default {
  input: "src/lib/index.ts",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true,
      inlineDynamicImports: true
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: true,
      inlineDynamicImports: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      dedupe: ['useTranslation', 'i18n', 'I18nextProvider'],
      preferBuiltins: false,
      browser: true
    }),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
    postcss({
      modules: true,
    }),
    images(),
    json(),
    copy({
      targets: [
        { src: 'src/lib/oro-global.css', dest: 'dist/public' },
        { src: 'src/lib/Form/oro-form-read-only.css', dest: 'dist/public' }
      ],
      verbose: true
    })
  ]
};
