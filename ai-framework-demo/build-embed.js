const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['./src/embed/embed.tsx'],
  bundle: true,
  minify: true,
  format: 'iife',
  outfile: 'dist/prioritization-framework.js',
  globalName: 'PrioritizationFramework',
  external: ['react', 'react-dom', 'recharts'],
  loader: { '.css': 'css' },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
}).catch(() => process.exit(1)); 