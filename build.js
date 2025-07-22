const esbuild = require('esbuild');
const path = require('path');

const isWatch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: ['src/app.ts'],
  bundle: true,
  outfile: 'dist/app.js',
  platform: 'browser',
  target: ['es2020'],
  sourcemap: true,
  minify: !isWatch,
  format: 'iife',
  loader: {
    '.ts': 'ts',
  },
  define: {
    'process.env.NODE_ENV': isWatch ? '"development"' : '"production"',
  },
};

if (isWatch) {
  esbuild
    .context(buildOptions)
    .then((ctx) => {
      ctx.watch();
      console.log('👀 Watching for changes...');
    })
    .catch(() => process.exit(1));
} else {
  esbuild
    .build(buildOptions)
    .then(() => {
      console.log('✅ Build complete');
    })
    .catch(() => process.exit(1));
}
