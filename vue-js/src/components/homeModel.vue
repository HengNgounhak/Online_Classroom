<template>
    <div class="model">
        <fa class="exit" icon="times" @click="$emit('closeModel')"/>
        <h5>{{ title }}</h5><br>
        <input v-model="input" :placeholder="placeholder">
        <p v-if="error">{{error}}</p>
        <br><br><br>
        <btn :text="btn" @click="$emit('inputModel', input), input=''" padding="8px 30px" size="16px"/>
    </div>
</template>

<script>
export default {
  props: ["title", "placeholder", "btn", "error"],
  data() {
    return {
      input: ''
    }
  },
}
</script>

<style scoped>
.model{
  width: 350px;
  background-color: white;
  border-radius: 15px;
  padding: 60px 40px 40px 40px;
  font-size: 16px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  color: #707070;
  text-align: center;
}
.exit{
  position: absolute;
  right: 20px;
  top: 15px;
  font-size: 20px;
  color: #707070;
  font-weight: lighter;
}
input{
    width: 100%;
    border: 1px solid#707070;
    height: 40px;
    border-radius: 20px;
    resize: none;
    padding: 7px 20px;
    color: #707070;
    font-size: 15px;
}
p{
  margin: 0px;
  color: red;
  font-size: 13px;
}
</style>