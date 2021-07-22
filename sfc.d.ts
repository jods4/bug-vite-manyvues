// These definitions are much better handled by adding @vuedx/typescript-plugin-vue to tsconfig plugins.

// Unforunately, TS only supports plugins in IDE and not at build time, so we need them anyway :(
declare module "@/Components/Datagrid/datagrid.vue" {
  import { Component, FunctionalComponent } from "vue";
  import type { Formatter } from "@/Components/Formatters";

  export type ColumnDefinition<TItem extends { id: string | number }> = {
    [K in keyof TItem]: {
      label?: string;
      data?: K;
      css?:
        | string
        | ((value: TItem[K], data: TItem) => string | null | undefined);
      header?: FunctionalComponent;
      // Strange `TItem extends any` close to work around incompatible assignment issues in templates
      render?:
        | Component
        | (TItem extends object
            ? Formatter<{ data: TItem; value: TItem[K] }>
            : any);
      resizable?: boolean;
      sortable?: boolean;
      searchable?: boolean;
      exportable?: boolean;
      sort?: number; // Initial sort order, 1-based. Negative numbers = desc.
      width?: number;
      nullsFirst?: boolean;
    };
  }[keyof TItem];

  export function getRowItem<T = object>(el: Element): T | undefined;
}

declare module "*.vue" {
  import { Component } from "vue";
  const component: Component;
  export default component;
}

declare module "*.svg" {
  import { FunctionalComponent } from "vue";
  const component: FunctionalComponent;
  export default component;
}

declare module "virtual:generated-pages" {
  import { RouteRecordRaw } from "vue-router";
  const routes: RouteRecordRaw[];
  export default routes;
}

// Copied from node_modules/vite/client.d.ts
// We don't want the whole thing because its declarations for `module "*.d.ts"` conflict with our icon plugin
interface ImportMeta {
  url: string;

  readonly hot?: {
    readonly data: any;

    accept(): void;
    accept(cb: (mod: any) => void): void;
    accept(dep: string, cb: (mod: any) => void): void;
    accept(deps: readonly string[], cb: (mods: any[]) => void): void;

    /**
     * @deprecated
     */
    acceptDeps(): never;

    dispose(cb: (data: any) => void): void;
    decline(): void;
    invalidate(): void;

    on(event: string, cb: (...args: any[]) => void): void;
  };

  readonly env: ImportMetaEnv;

  glob(pattern: string): Record<
    string,
    () => Promise<{
      [key: string]: any;
    }>
  >;

  globEager(pattern: string): Record<
    string,
    {
      [key: string]: any;
    }
  >;
}

interface ImportMetaEnv {
  [key: string]: string | boolean | undefined;
  BASE_URL: string;
  MODE: string;
  DEV: boolean;
  PROD: boolean;
}
