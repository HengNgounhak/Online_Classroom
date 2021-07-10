<template>
  <div class="container">
    <div class="pic">
      <h1>Welcome To The Class</h1>
      <img src="../assets/signup.jpg">
    </div>
    <div class="right">
      <form @submit.prevent="register">
        <h3 class="mx-auto text-center">Sign Up</h3>
        <br>
        <div class="form-group">
            <label>Username</label>
            <input v-model="username" class="form-control" type="text" required>
        </div>
        <div class="form-group">
            <label>Email Address</label>
            <input v-model="email" class="form-control" type="email" id="email" required>
            <p v-show="isExist">This email have been used (please use other email).</p>
        </div>
        <div class="form-group">
            <label>Password</label>
            <input v-model="password" class="form-control" minlength="8" type="password" id="Password" required>
        </div>
        <div class="form-group">
            <label>Confirm Password</label>
            <input v-model="confirmpassword" class="form-control" minlength="8" type="password" id="ConfirmPassword" required>
            <p v-show="notMatch">Password and Confirm Password is match with each other.</p>
        </div>
        <br>
        <button type="summit" class="btn btn-primary btn-block font-weight-bold">Register</button>
        <div class="footer">
          <br>
          <span>or</span>
          <br>
          <router-link to="/signin"><label>Already have an account?</label></router-link>
        </div>
      </form>
    </div>
    
  </div>
</template>

<script>
import api from '../services/api'
export default {
  name: 'SignUp',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmpassword: '',
      notMatch: false,
      isExist: false
    }
  },
  methods: {
    register(){
      if(this.password == this.confirmpassword){
        this.notMatch = false
        api().post('register',{ //send data to node js
          username: this.username,
          email: this.email,
          password: this.password
        }).then((value) => {
          //confirm for success register
          if(value.data.success){
            this.redirect()
          }
          this.isExist = value.data.existEmail
        }).catch((err) => {
          console.log(err)
        })
      }else{
        this.notMatch = true
      }
    },
    redirect() {
      this.$router.push({name: 'signin'})
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
  max-width: 90%;
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
  padding-top: 10px;
  align-items: center;
}
form{
  width: 80%;
}
h1, h3{
  color: #157CFC;
}
label{
  margin: 0px;
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
    font-size: 34px;
  }
  h3 {
    font-size: 28px;
  }
  img{
    display: none;
  }
  .container{
    flex-direction: column;
    width: 80% !important;
  }
  .pic, .right{
    width: 80%;
    margin: auto;
  }
  form{
    margin: auto;
  }
}

@media(max-width: 900px) {

}

@media(max-width: 800px) {
  .container{
    padding-top: 20px;
  }
  h1 {
    font-size: 30px;
  }
  h3 {
    font-size: 24px;
  }
  form{
    width: 90%;
  }

  .pic, .right{
    width: 90%;
    margin: auto;
    padding: 0px;
  }

}

@media(max-width: 700px) {

}
</style>
