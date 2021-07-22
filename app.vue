<template>
  <adorner-layer>
    <router-view v-slot="{ Component, route }">
      <suspense :key="route.path">
        <component :is="Component" />
      </suspense>
    </router-view>
  </adorner-layer>
</template>

<script lang="ts">
  import AdornerLayer from "./Components/App/adorner-layer";

  export default {
    components: {
      "adorner-layer": AdornerLayer,
    },
  };
</script>

<style lang="postcss">
  body {
    display: grid;
    grid: fit-content(100%) 1fr / 200px 1fr;
    height: 100vh;
  }

  header {
    grid-column: 1 / span 2;
  }

  nav {
    grid-column: 1;
    grid-row: 2;
  }

  main {
    @apply px-3 py-2 overflow-hidden bg-white;
    @apply flex flex-col gap-3; /* These are good default for most pages layout -- they can be locally overriden */
    grid-row: 2;
    grid-column: 2;
    transition: filter 0.2s;
  }
</style>
