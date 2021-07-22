import { Dayjs } from "dayjs";
import type { FunctionalComponent, Ref } from "vue";

declare global {
  type MaybeRef<T> = T | Ref<T>;

  type MaybePromise<T> = T | Promise<T>;

  type KeyOfType<T, TProp> = {
    [P in keyof T]: T[P] extends TProp ? P : never;
  }[keyof T];

  type ApiType<T extends (...args: any) => any> = ReturnType<T> extends Promise<
    infer U
  >
    ? U
    : never;

  type ApiListType<T extends (...args: any) => any> =
    ReturnType<T> extends Promise<(infer U)[]> ? U : never;

  // Same as Partial<T> built-in TS type, but also allows nulls
  type PartialNull<T> = T extends Dayjs
    ? T
    : T extends Object
    ? {
        [k in keyof T]?: PartialNull<T[k]> | null;
      }
    : T;
}

declare module "vue-router" {
  // Augment vue-router "unknown" RouteMeta interface with the typed meta we use in this project

  export interface RouteMeta {
    nav?: string[];
    auth?: string;
    order?: number;
    navGroup?: import("./Components/App/nav").NavGroup | null;
  }
}

declare module "vue" {
  // Declare all global components for Volar IDE support
  interface GlobalComponents {
    RouterLink: typeof import("vue-router").RouterLink;
    RouterView: typeof import("vue-router").RouterView;

    GlobalEvents: typeof import("vue-global-events").GlobalEvents;

    AppLoading: typeof import("./Components/App/loading").AppLoading;
    DataGrid: typeof import("./Components/Datagrid/datagrid.vue").default;
    UiDialog: typeof import("./Components/Dialogs").UiDialog;
    UiLoading: typeof import("./Components/Helpers/loading.vue").default;
    UiList: typeof import("./Components/Lists/simple.vue").default;
    UiListCheckbox: typeof import("./Components/Lists/checkbox.vue").default;
    UiHeader: typeof import("./Components/header.vue").default;
    UiScroll: typeof import("./Components/scroll.vue").default;

    UiButton: typeof import("./Components/Forms/button.vue").default;
    UiCombo: typeof import("./Components/Forms/combo.vue").default;
    UiDate: typeof import("./Components/Forms/date.vue").default;
    UiForm: typeof import("./Components/Forms/form.vue").default;
    UiField: typeof import("./Components/Forms/field.vue").default;
    UiRadio: typeof import("./Components/Forms/radio.vue").default;
    UiRadioGroup: typeof import("./Components/Forms/radio-group.vue").default;
    UiText: typeof import("./Components/Forms/text.vue").default;
    UiTextarea: typeof import("./Components/Forms/textarea.vue").default;
    UiNumber: typeof import("./Components/Forms/number.vue").default;
    UiMultiSelect: typeof import("./Components/Forms/multi-select.vue").default;
    ValGroup: typeof import("./Components/Forms/validation-group.vue").default;

    IconCheck: FunctionalComponent;
    IconDownload: FunctionalComponent;
    IconInfo: FunctionalComponent;
    IconRefresh: FunctionalComponent;
    IconTrash: FunctionalComponent;
    IconWarning: FunctionalComponent;
    IconX: FunctionalComponent;
  }
}

// Augment style properties with our custom CSS variables so that Volar can typecheck properly
declare module "csstype" {
  interface Properties {}
}
