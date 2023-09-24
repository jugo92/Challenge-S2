<template>
  <a :href="linkAction"  class="mt-20">
    <button :class="color" class="text-white">
      {{text}}
    </button>
  </a>
</template>

<script>
export default {
  name: "Button",
  props: ['text', 'color', 'linkAction'],
}
</script>

<style scoped>

</style>