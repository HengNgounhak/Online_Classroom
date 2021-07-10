<template>
    <div>
        <div class="header">
            <h3>The Class</h3>
            <router-link to="/"><button id="back"><fa icon="angle-left"/> Back</button></router-link>
        </div>
        <div class="container">
            <div class="text-center">
                <profile v-if="profile != ''" :path="profile" size="100px"/>
                <profile v-else size="64px"/>
                <br>
                <input @change="onFileChange" type="file" name="photo" id="photo" style="display:none;" accept="image/*">
                <button @click="getInput" id="buttonUpload">Upload Profile Picture</button>
            </div>
            <br>
            <form @submit.prevent="changeUser" enctype="multipart/form-data">
                <div class="form-group">
                    <label>Username</label>
                    <input v-model="username" class="form-control" type="text" id="username" required>
                </div>
                <div class="form-group">
                    <label>Email Address</label>
                    <input v-model="email" class="form-control" type="email" id="email" @keydown.space.prevent required>
                </div>
                <div class="form-group">
                    <label>New password(not required)</label>
                    <input v-model="newPwd" class="form-control" type="password" id="newPwd">
                    <p v-show="nonEnough">Password require 8 digits</p>
                </div>
                <div class="form-group">
                    <label>Confirm new password(not required)</label>
                    <input v-model="newConfirmPwd" class="form-control" type="password" id="newConfirmPwd">
                    <p v-show="nonEnough">Password require 8 digits</p>
                    <p v-show="nonSame">Password and Confrim password is not the same.</p>
                </div>
                <div class="text-center">
                    <btn type=summit text="Save Change" size="20px"/> 
                </div>
            </form>
        </div>
    </div>
    
</template>

<script>
import {mapActions} from 'vuex'
import api from '../services/api'

export default {
    data() {
        return {
            userId: this.$store.getters.user.id,
            username: this.$store.getters.user.username,
            email: this.$store.getters.user.email,
            profile: this.$store.getters.user.profile,
            newPwd: '',
            newConfirmPwd: '',
            nonSame: false,
            nonEnough: false
        }
    },
    methods: {
        getInput(){
            document.getElementById('photo').click()
            console.log(this.user)
        },
        onFileChange (e){
            const photo = e.target.files[0]
            let formData = new FormData()
            formData.append('photo', photo);
            api().post('updateProfile/'+this.userId, formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((result) => {
                console.log(result)
                if(result.data.token){
                    this.$cookies.set('token', result.data.token, 60 * 60 * 4)
                    this.$router.go() 
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        changeUser(){
            if(this.username == this.$store.getters.user.username && this.email == this.$store.getters.user.email 
            && this.newPwd == '' && this.newConfirmPwd == ''){
                this.$router.push({name: 'home'})
            }else{
                if(this.newPwd == '' && this.newConfirmPwd == ''){
                    api().post('updateUser/'+this.$store.getters.user.id,{
                        username: this.username,
                        email: this.email
                    }).then((result) => {
                        if(result.data.token){
                            this.$cookies.set('token', result.data.token, 60 * 60 * 4)
                            this.$router.push('/') 
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                }else{
                    if(this.newPwd != this.newConfirmPwd){
                        this.nonSame = true
                    }else if(this.newPwd.length < 8 && this.newConfirmPwd.length < 8){
                        this.nonEnough = true
                    }else{
                        this.nonEnough = false
                        this.nonSame = false
                        api().post('updateUser/' + this.$store.getters.user.id,{
                        username: this.username,
                        email: this.email,
                        newPwd: this.newPwd
                        }).then((result) => {
                            if(result.data.token){
                                this.$cookies.set('token', result.data.token, 60 * 60 * 4)
                                this.$router.push('/') 
                            }
                        }).catch((err) => {
                                console.log(err)
                            })
                        }
                }
            }
        },
        ...mapActions(['getUser'])
    },
    async created() {
        //prevent this page for not login
        if(!this.$cookies.get('token')){
            this.$router.push('/signin') 
        }else{           
            await this.getUser(this.$cookies.get('token'))
            this.username = this.$store.getters.user.username
            this.email = this.$store.getters.user.email
            this.userId = this.$store.getters.user.id
            this.profile = this.$store.getters.user.profile
        }
    }
}


</script>

<style scoped>
.header{
    width: 100%;
    border-bottom: 1px solid #707070;
    padding: 20px;
    text-align: center;
    position: relative;
    color: #1177BE;
}
#back{
    position: absolute;
    left: 80px;
    bottom: 35%;
    border: none;
    background-color: white;
    font-weight: bold;
    font-size: 20px;
    color: #1177BE;
}

.container{
    background-color: white;
    padding: 50px 100px;
    box-shadow: 0px 0px 8px 0px #707070;
    border-radius: 30px;
    margin: 20px auto;
    max-width: 700px;
    min-width: 500px;
    width: 50%;
}

label{
    margin-top: 5px;
    font-weight: bold;
    color: #707070;
}

input{
    border: none;
    border-bottom: 2px solid #707070;
    border-radius: 0px;
}

p{
    color: red;
    font-size: 14px;
    margin: 0px;
}

#buttonUpload{
    border: none;
    background-color: white;
    font-weight: bold;
    color: #1177BE;
    font-size: 14px;
}
</style>