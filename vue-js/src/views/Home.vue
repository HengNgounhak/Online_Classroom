<template>
    <div>
        <blur v-show="btnJoinCreate" @click="joinCreate"/>
        <blur v-show="isAccount" @click="account"/>
        <blur bdcolor="#9F9F9F" v-show="isBlur" @click="blur"/>
        <div class="header">
            <h3>The Class</h3>
            <div class="right">
                <button @click="joinCreate"><fa icon="plus" /> Join & Create Class</button> <profile :path="user.profile" @click="account" size="42px" class="ml-3"/>
                <!-- <multiBtn v-show="btnJoinCreate" class="joinCreate"/> -->
                <div class="multi" v-show="btnJoinCreate">
                    <button @click="model('join')">Join class</button>
                    <br>
                    <button @click="model('create')">Create class</button>
                </div>
            </div>
            <div v-show="isAccount" class="account">
                <profile :path="user.profile" class="mb-3" size="58px" />
                <h4 class="m-0" v-if="user">{{ user.username }}</h4>
                <p v-if="user">{{ user.email }}</p>
                <br>
                <br>
                <router-link to="/account"><btn text="Manage your account" /></router-link>
                <br>
                <br>
                <br>
                <!-- <button >Sign Out</button> -->
                <btn @click="signout" size="18px" text="Sign Out"/>
            </div>
        </div>
        <div v-if="classes.length>0" class="classes">
            <class v-for="myClass in classes" :key="myClass._id" :className="myClass.name" :teacherId="myClass.teacher" :cId="myClass._id" :cCode="myClass.code" @editClass="getClass"/>            
        </div>
        <div v-else class="text-center mt-5">
            <img class="empty w-25" src="../assets/emptyClass.jpg">
            <h5 class="mt-3">No class</h5>
        </div>
        <home-model @inputModel="createClass" title="Create a class" placeholder="Class name..." btn="Create" :error="errorInput" v-show="isCreate" @closeModel="blur"/>
        <home-model @inputModel="joinClass" title="Enter code to join class" placeholder="Code..." btn="Join" :error="errorInput" v-show="isJoin" @closeModel="blur"/>
    </div>
</template>

<script>
import homeModel from '../components/homeModel.vue'
import api from '../services/api'
import { mapActions } from 'vuex'

export default {
    components: { homeModel },
    name: "Home",
    data(){
        return{
            btnJoinCreate: false,
            isAccount: false,
            isBlur: false,
            isJoin:false,
            isCreate: false,
            errorInput: '',
            classes: {}
        }
    },
    methods: {
        joinCreate(){
            this.btnJoinCreate = !this.btnJoinCreate
        },
        account(){
            this.isAccount = !this.isAccount
        },
        model(type){
            this.isBlur = !this.isBlur
            this.btnJoinCreate = false
            if(type=="join"){
                this.isJoin = !this.isJoin
            }else{
                this.isCreate = !this.isCreate
            }
        },
        blur(){
            this.isBlur = false
            this.isJoin = false
            this.isCreate = false
            this.errorInput = ""
        },
        signout(){
            //remove cookie
            this.$cookies.remove("token")
            this.$cookies.remove('userState')
            this.$cookies.remove('cId')
            //remove session in server
            api().post('logout').catch((err) => {
                console.log(err)
            })
            this.redirectSignin() 
        },
        redirectSignin() {
            this.$router.push({name: 'signin'})
        },
        createClass(name){
            var sameName = false
            for(var i=0; i<this.classes.length; i++){
                var myClass = this.classes[i]
                if(myClass.name == name){
                    this.errorInput = "This name is already used"
                    sameName = true
                    break
                }
            }
            if(!sameName){
                api().post('create',{
                    name: name,
                    tId: this.$store.state.user.id
                }).then((result) => {
                    if(result.data.success){
                        this.blur()
                        this.isCreate = false
                        this.getClass()
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        },
        joinClass(code){
            api().put('join',{
                code: code,
                sId: this.$store.state.user.id
            }).then((result) => {
                if(result.data.success){
                    this.blur()
                    this.isCreate = false
                    this.getClass()
                }else{
                    this.errorInput = "Invalide code"
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        getClass(){
            api().post('getClass', {
                userId: this.$store.getters.user.id
            }).then((result) => {
                this.classes = result.data
            }).catch((err) => {
                console.log(err)
            })
        },
        ...mapActions(['getUser'])
    },
    async created() {
        
        //prevent this page for not login
        if(!this.$cookies.get('token')){
            this.redirectSignin() 
        }else{           
            await this.getUser(this.$cookies.get('token'))
            await this.getClass()
        }
    },
    computed: {
        user(){
            return this.$store.getters.user
        }        
    },
    watch:{
        isBlur(){
            this.getClass()
        }
    }
}
</script>

<style scoped>
.header{
    width: 100%;
    border-bottom: 1px solid #707070;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 20px 40px;
    align-items: center;
    padding-left: 80px;
    position: relative;
}
h3, button{
    color: #1177BE;
}

button{
    border: 1px solid #707070;
    border-radius: 25px;
    background-color: white;
    padding: 5px 20px;
    font-weight: bold;
}

.right{
    display: flex;
    position: relative;
}

.multi{
    box-shadow: 0px 0px 4px 0px #707070;
    border-radius: 10px;
    padding: 12px;
    background-color: white;
    position: absolute;
    bottom: -240%;
    left: -100px;
    z-index: 1;
}
.multi button{
    border: none;
    background-color: white;
    color: #1177BE;
    font-weight: bold;
    margin: 2px 0px;
}

.account{
    position: absolute;
    bottom: -520%;
    right: 20px;
    z-index: 1;
    background-color: white;
    text-align: center;
    padding: 50px 100px;
    box-shadow: 0px 0px 4px 0px #707070;
    border-radius: 20px;
}

.account h4, p, h5{
    color: #707070;
}


.classes{
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    padding: 30px 60px;
    margin: auto;
}

.empty{
    border-radius: 20px;
    opacity: 0.6;
    min-width: 300px;
}
</style>