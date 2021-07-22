import path from 'path';
import { defineConfig } from 'vite';
import pages from 'vite-plugin-pages';
import svg from 'vite-plugin-svg-sprite';
import vue from '@vitejs/plugin-vue';
import ts from 'rollup-plugin-typescript2';

// Modify built the template of vite-plugin-svg-sprite,
// which returns the id string of the sprite,
// to return a Vue component instead
const svgPlugin = svg({ symbolId: 'icon-[name]'});
const svgTransform = svgPlugin.transform;
svgPlugin.transform = async (src, filePath) => {
  let module = await svgTransform(src, filePath);
  if (module) {
    module =
      "import Icon from '/Components/Icon.vue';\n" +
      module.replace(
        /export default ["']([^"']*)["'];/,
        `export default () => Icon({ href: "#$1" })`);
  }
  return module;
}

function moveToMeta(route, prop) {
  if (prop in route) {
    route.meta[prop] = route[prop];
    delete route[prop];
  }
}

export default defineConfig(({ command, mode }) => ({
  plugins: [
    vue(),
    pages({
      pagesDir: 'Modules',
      exclude: ['**/Components/**'],
      extensions: ['vue'],
      routeBlockLang: "yaml",
      extendRoute(route) {
        // For convenience, we set meta-properties directly in <route> but they should be under `meta`
        if (!route.meta) route.meta = {};
        if (route.nav) route.nav = route.nav.split("/");
        moveToMeta(route, 'nav');
        moveToMeta(route, 'auth');
        moveToMeta(route, 'order');
      },
      onRoutesGenerated(routes) {
        routes = ['Blotter', 'Portal'].includes(mode)
          ? routes.filter(r => !r.env || r.env === mode)
          : routes;
        routes.forEach(r => delete r.env);
        return routes;
      },
    }),
    svgPlugin,
    {
      apply: 'build', // We use the real TS compiler when building, ESBuild (no check) for dev
      ...ts(),
    },
    {
      name: 'svg-asset-remover',
      generateBundle(_, bundle) {
        // do not emit svg assets as they have been packed by svgPlugin
        for (const file in bundle) {
          if (bundle[file].type === 'asset' && file.endsWith('.svg'))
            delete bundle[file]
        }
      }
    }
  ],

  define: {
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: false,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },

  esbuild: command !== 'build',

  build: {
    target: 'esnext',
    outDir: '../Portal/wwwroot',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          const match = /\/Modules\/([^\/]+)\//.exec(id);
          if (match) return match[1];
        }
      }
    }
  },
}));