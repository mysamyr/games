import * as esbuild from 'esbuild';

(async () => {
  await esbuild.build({
    entryPoints: ['main.js', 'styles.css'],
    outdir: 'dist',
    bundle: true,
    minify: true,
    minifyWhitespace: true,
    minifySyntax: true,
    write: true,
    sourcemap: false,
    target: ['chrome58', 'firefox57', 'safari11'],
  });
})();
