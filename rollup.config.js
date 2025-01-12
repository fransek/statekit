import typescript from "@rollup/plugin-typescript";

const input = "src/index.ts";

const getConfig = (format, dir) => ({
  input,
  external: ["react"],
  output: {
    dir,
    format,
    sourcemap: true,
    preserveModules: true,
  },
  plugins: [
    typescript({
      compilerOptions: {
        declarationDir: dir,
        emitDeclarationOnly: true,
      },
    }),
  ],
});

export default [getConfig("cjs", "dist"), getConfig("esm", "dist/esm")];
