<template>
    <div class="model">
        <h1><fa class="exit" icon="exclamation-triangle"/></h1>
        <p>{{ text }}</p><br>
        <div class="btn">
            <btn text="Cancel" @click="$emit('cancel')" padding="5px 15px" size="16px"/>
            <btn text="Ok" @click="$emit('confirm')"  padding="5px 30px" size="16px"/>
        </div>
    </div>
</template>

<script>
export default {
  props: ["text"],
}
</script>

<style scoped>
.model{
  width: 350px;
  background-color: white;
  border-radius: 15px;
  padding: 30px 40px;
  font-size: 16px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  color: #707070;
  text-align: center;
}

p, h1{
  /* margin: 0px; */
  color: red;
}
.btn{
    display: flex;
    justify-content: space-between;
}
</style>