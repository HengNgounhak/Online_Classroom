<template>
  <button v-if="summit" type="summit" :style="{ color: color, 'font-size': size, padding: padding }" :disabled="disabled">{{text}}</button>
  <button v-else type="button" :style="{ color: color, 'font-size': size, padding: padding }" :disabled="disabled">{{text}}</button>
</template>

<script>
export default {
  props: ["text", "color", "size", "padding", "disabled", "summit"]
}
</script>

<style scoped>
button{
  border: 1px solid #707070;
  border-radius: 25px;
  background-color: white;
  padding: 10px 20px;
  font-weight: bold;
  color: #1177BE;
}
button:hover{
  background-color: #70707070;
}
</style>