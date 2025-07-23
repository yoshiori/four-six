const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const isWatch = process.argv.includes('--watch');

// Build CSS with PostCSS
function buildCSS() {
  try {
    execSync('npx postcss ./src/input.css -o ./dist/app.css', {
      stdio: 'inherit',
    });
    console.log('🎨 CSS built successfully');
  } catch (error) {
    console.error('❌ CSS build failed:', error.message);
    process.exit(1);
  }
}

// Copy static files to dist
function copyStaticFiles() {
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }

  // Copy HTML files from src to dist
  const srcHtmlFiles = ['src/index.html'];
  srcHtmlFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      const filename = path.basename(file);
      fs.copyFileSync(file, `dist/${filename}`);
      console.log(`📄 Copied ${filename}`);
    }
  });
}

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
      // Build CSS with PostCSS
      buildCSS();
      // Copy HTML files to dist
      copyStaticFiles();
      console.log('✅ Build complete');
    })
    .catch(() => process.exit(1));
}
