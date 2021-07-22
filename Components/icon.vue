<script lang="ts">
  import { h } from "vue";
  export default function ({ href }: { href: string }) {
    return h("svg", { class: "icon" }, [h("use", { href })]);
  }
</script>

<style>
  .icon {
    height: 1em;
    aspect-ratio: 1;
    fill: currentcolor;
    align-self: center;
  }
</style>
