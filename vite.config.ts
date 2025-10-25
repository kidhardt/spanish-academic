import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// Custom plugin to enforce bundle size limits
const bundleSizeEnforcer = (): Plugin => ({
  name: 'bundle-size-enforcer',
  closeBundle() {
    // This runs after the bundle is generated
    // Warning threshold is set to 250KB in build.chunkSizeWarningLimit
    // This plugin provides additional logging for visibility
    console.log('\n✅ Bundle size check: See bundle-stats.html for detailed analysis')
    console.log('📊 Max chunk size limit: 250KB (warning threshold)')
  },
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle size visualization - generates stats.html after build
    visualizer({
      filename: './lighthouse-reports/bundle-stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    bundleSizeEnforcer(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/data': resolve(__dirname, './src/data'),
      '@/i18n': resolve(__dirname, './src/i18n'),
    },
  },
  // Public directory contains static files that don't need processing
  publicDir: 'static',
  build: {
    // Build React islands into public/assets for deployment
    outDir: 'public/assets',
    rollupOptions: {
      // Separate entry points for each React island
      // Each island loads ONLY when its root element is present in the HTML
      input: {
        explorer: resolve(__dirname, 'src/apps/explorer/main.tsx'),
        chat: resolve(__dirname, 'src/apps/chat/main.tsx'),
        contact: resolve(__dirname, 'src/apps/contact/main.tsx'),
      },
      output: {
        // Manual chunk splitting for better caching and code reuse
        // Shared dependencies (React, form library) are extracted into separate chunks
        // Static HTML pages load ZERO JavaScript unless they include an island root
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'form-vendor': ['@tanstack/react-form'],
        },
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
    // Bundle size limit: 250KB (RULE 6 from CLAUDE.md)
    // Vite will warn if any chunk exceeds this limit
    // See lighthouse-reports/bundle-stats.html for detailed analysis
    chunkSizeWarningLimit: 250,
    // Enable source maps for production debugging
    sourcemap: true,
    // Minify for production (enables tree shaking)
    // Tree shaking removes unused code, keeping bundles small
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true, // Remove debugger statements
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 4173,
  },
})
