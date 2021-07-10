<template>
    <div class="blur position-fixed" :style="{ 'background-color': bdcolor }"></div>
</template>

<script>
export default {
  props: ["bdcolor"]
}
</script>

<style scoped>
.blur{
  position: absolute;
  /* background-color: #9F9F9F; */
  background-color: #ffffff00;
  opacity: 70%;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1;
}
</style>