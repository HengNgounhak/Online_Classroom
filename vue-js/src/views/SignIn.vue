<template>
  <div class="container">
    <div class="pic">
      <h1>Welcome To The Class</h1>
      <img src="../assets/signin.jpg">
    </div>
    <div class="right">
      <form @submit.prevent="login">
        <h3 class="mx-auto text-center">Sign In</h3>
        <br>
        <div class="form-group">
            <label>Email Address</label>
            <input v-model="email" class="form-control" type="email" id="exampleInputEmail1" required>
            <p v-show="exist">Don't have this email (please register).</p>
        </div>
        <div class="form-group">
            <label>Password</label>
            <input v-model="password" class="form-control" minlength="8" type="password" id="Password" required>
            <p v-show="wrongPwd">Incorrect password.</p>
        </div>
        <br>
        <button type="summit" class="btn btn-primary btn-block font-weight-bold">Log In</button>
        <div class="footer">
          <br>
          <span>or</span>
          <br>
          <router-link to="/signup"><label>Create an account?</label></router-link>
        </div>
      </form>
    </div>
    
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'SignIn',
  data() {
    return {
      email: '',
      password: '',
      exist: false,
      wrongPwd: false
    }
  },
  methods: {
    login(){
      api().post('login',{ //send data to node js
        password: this.password,
        email: this.email,
      }).then((value) => {
        //confirm for success register
        if(value.status === 200 && 'token' in value.data){
          // if(value.data.id != null){
          //   this.redirect(value.data.id)
          // }
          // this.$store.state.token = value.data.token
          // this.$store.state.user = value.data.user
          this.$cookies.set('token', value.data.token, 60 * 60 * 4)
          this.redirect()
          // console.log("mytoken=====", this.$store.state.user.id)
          // console.log("mytoken+++++", this.$cookies.get('user').email)
        }
        if(value.data.id == 0){
            this.wrongPwd = true
        }
        this.exist = value.data.existEmail
      }).catch((err) => {
        console.log(err)
      })
    },
    redirect() {
      this.$router.push({name: 'home'})
    }
  },
  created() {
    //prevent this page for already login
    if(this.$cookies.get('token')){
      this.redirect() 
    }
  }
}
</script>

<style scoped>
input{
  border: none;
  border-bottom: 2px solid #157CFC;
  border-radius: 0px;
}
img{
  max-width: 80%;
}
.container{
  padding-top: 40px;
  padding-bottom: 20px;
  display: flex;
  justify-content: space-evenly;
  width: 1500px;
  width: 90%;
  box-shadow: 0px 0px 15px 1px #157CFC;
  border-radius: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.pic{
  width: 50%;
  text-align: center;
}
.right{
  width: 40%;
  padding-top: 40px;
  align-items: center;
}
form{
  width: 80%;
}
h1, h3{
  color: #157CFC;
}
label{
  margin-top: 10px;
  color: #707070;
}
button{
  border-radius: 20px;
}
span{
  color: #157CFC;
  font-weight: bold;
}
.footer{
  text-align: center;
}
a{
  text-decoration: none;
}
p{
  margin: 0px;
  color: red;
  font-size: 13px;
}
@media(max-width: 1000px) {
  h1 {
    font-size: 32px;
  }
  h3 {
    font-size: 28px;
  }
  form{
    margin: auto;
  }
  .container{
    flex-direction: column;
  }
  img{
    display: none;
  }
  .pic, .right{
    margin: auto;
    width: 80%;
  }
  .right{
    padding-top: 10px;
  }
}

@media(max-width: 800px) {
  h1 {
    font-size: 30px;
  }
  h3 {
    font-size: 24px;
  }
}

</style>
