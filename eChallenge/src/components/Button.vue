<template>
  <a :href="linkAction" :class="color">
    {{text}}
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