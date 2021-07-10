<template>
  <div>
    <class-bar/>
    <btn-home/>
    <div class="people">
      <p class="title">Teacher</p>
      <table>
        <tr-student v-for="tId in teacher" :key="tId" :sId="tId" :noMore="true"/>
      </table>
      <p class="title">Student</p>
      <table>
        <tr-student v-for="sId in student" :key="sId" :sId="sId" :noMore="false"/>
        <div v-if="student.length<1" class="text-center">
            <img class="empty w-75" src="../assets/emptyStudent.jpeg">
            <h5 class="mt-3">No student</h5>
        </div>
      </table>
    </div>
  </div>
    
</template>

<script>
import BtnHome from '../components/BtnHome.vue'
import ClassBar from '../components/ClassBar.vue'
import TrStudent from '../components/trStudent.vue'
import api from '../services/api'
import {mapActions} from 'vuex'
export default {
  components: { ClassBar, TrStudent, BtnHome },
  data() {
    return {
      student: [],
      teacher: []
    }
  },
  methods: {
    ...mapActions(['getUser']),
    async getAClass(){
      await api().post('aClass/'+this.$cookies.get('class').cId).then((result) => {
        if(result){
          this.teacher = result.data.myClass.teacher
          this.student = result.data.myClass.student
          // console.log(result.data, "00000", this.student)
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  async created() {
    //prevent this page for not login
    if(!this.$cookies.get('token')){
      this.$router.push({name: 'signin'}) 
    }else{           
      await this.getUser(this.$cookies.get('token'))
      await this.getAClass()

      let haveThisUser = false
      for(var st in this.student){
        if(this.student[st]==this.$store.getters.user.id){
          haveThisUser = true
          break
        } 
      }
      for(var t in this.teacher){
        if(this.teacher[t]==this.$store.getters.user.id){
          haveThisUser = true
          break
        } 
      }
      if(haveThisUser == false){
        this.$router.push({name: 'home'}) 
      }
    }
    // console.log(this.student, "//////", this.$store.getters.user) 
  },
}
</script>

<style scoped>
.people{
  width: 60%;
  margin: auto;
}
.title{
  font-size: 32px;
  color: #1177BE;
  margin-top: 20px;
  margin-bottom: 0px;
}

table{
  width: 100%;
  border-top: 1px solid #1177BE;
  padding-top: 20px;
}

.empty{
    border-radius: 20px;
    opacity: 0.6;
    min-width: 400px;
    margin-top: 50px;
}

h5{
    color: #707070;
}
</style>