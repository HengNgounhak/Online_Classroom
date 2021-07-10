<template>
  <div class="announceComment position-fixed">
    <fa class="exit" icon="times" @click="$emit('closeComment')"/>
    <comment v-for="(c, index) in allCmt" :key="index" :cmt="c" @deleteCmt="deleteCmt"/>
    <form @submit.prevent="newCmt">
      <profile/><textarea v-model="cmt" placeholder="Comment ..." required></textarea><button type="summit" :disabled="toDisabled"><img src="../assets/send-black.svg"></button>
    </form>
  </div>
</template>

<script>
import Comment from './Comment.vue'
import api from '../services/api'
export default {
  components: {Comment},
  props: ['postId'],
  data() {
    return {
      cmt: '',
      allCmt: []
    }
  },
  methods: {
    newCmt(){
      api().post('newComment',{
        postId: this.postId,
        userId: this.$store.getters.user.id,
        text: this.cmt
      }).then((result) => {
        if(result.data.success){
          this.cmt = ''
          this.getCmt()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getCmt(){
      api().post('getComment/'+this.postId).then((result) => {
        this.allCmt = result.data.comment
        this.$emit('numCmt', this.allCmt.length)
      }).catch((err) => {
        console.log(err)
      })
    },
    deleteCmt(){
      this.getCmt()
    }
  },
  computed:{
    toDisabled(){
      if(this.cmt){
        return false
      }else{
        return true
      }
    }
  },
  async created() {
    await this.getCmt()
  },
}
</script>

<style scoped>

.announceComment{
  width: 550px;
  background-color: white;
  border-radius: 15px;
  padding: 40px;
  font-size: 14px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}
.exit{
  position: absolute;
  right: 15px;
  top: 10px;
  font-size: 18px;
  color: #707070;
}
form{
  display: flex;
  align-items: center;
  position: relative;
  padding-right: 10px;
}

textarea{
  margin-left: 10px;
  height: 32px;
  width: 100%;
  border: 1px solid #707070;
  color: #707070;
  padding: 5px 30px 5px 20px;
  border-radius: 18px;
  font-size: 14px;
  resize: none;
}

button{
  background-color: rgba(255, 255, 255, 0);
  border: none;
  position: absolute;
  right: 15px;
  bottom: 8px;
}

img{
  width: 20px;
  height: 18px;
}
</style>