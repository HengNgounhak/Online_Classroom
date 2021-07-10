<template>
    <form @submit.prevent="submit">
        <textarea v-model="cmt"></textarea><button type="summit"><img src="../assets/send-black.svg"></button>
    </form>
</template>

<script>
export default {
  data() {
    return {
      cmt: ''
    }
  },
  methods: {
    submit(){
      this.$emit('commentText', this.cmt)
      this.cmt = ''
    }
  },
}
</script>

<style scoped>
form{
  display: flex;
  align-items: center;
  position: relative;
}

textarea{
    height: 32px;
    width: 100%;
    border: none;
    border-bottom: 1px solid #707070;
    color: #707070;
    padding: 5px 30px 5px 20px;
    font-size: 14px;
    resize: none;
}

button{
  background-color: rgba(255, 255, 255, 0);
  border: none;
  position: absolute;
  right: 5px;
  bottom: 5px;
}

img{
  width: 20px;
  height: 18px;
}
</style>