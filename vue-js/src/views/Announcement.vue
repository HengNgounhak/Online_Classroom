<template>
    <div>
        <blur v-show="isBlur"/>
        <class-bar />
        <btn-home />
        <div v-if="isTeacher == 'true'">
            <div class="new" @click="add" v-show="isNew">
                <profile /><span>New announcement</span>
            </div>
            <div class="add" v-show="isAdd">
                <textarea v-model="text" placeholder="New announcement"></textarea>
                <file-upload @removeFile="removeFile" v-for="(f, index) in fName" :key="index" :fileName="f" :haveRemove="true"/>
                <div class="btn">
                    <btn-upload @getFile="myFiles" idfile="newAnnounceFile" text="Upload" color="#707070" size="14px" padding="5px 15px"/>
                    <div class="right">
                        <btn @click="add" text="Cancel" size="14px" padding="5px 15px"/>
                        <btn @click="newPost" class="ml-2" text="Post" size="14px" padding="5px 15px" :disabled="toDisable"/>
                    </div>
                </div>
            </div> 
        </div>
        <announce v-for="(p, index) in post" :key="index" :myPost="p" @comment="blur"/>
        <div v-if="post.length<1" class="text-center">
            <img class="empty w-25" src="../assets/emptyAnnounce.png">
            <h5 class="mt-3">No announcement</h5>
        </div>
    </div>
</template>

<script>
import Announce from '../components/announce.vue'
import Blur from '../components/blur.vue'
import BtnHome from '../components/BtnHome.vue'
import BtnUpload from '../components/BtnUpload.vue'
import ClassBar from '../components/ClassBar.vue'
import FileUpload from '../components/fileUpload.vue'
import {mapActions} from 'vuex'
import api from '../services/api'

export default {
    components: { ClassBar, Announce, BtnHome, BtnUpload, Blur, FileUpload },
    data(){
        return{
            isAdd: false,
            isNew: true,
            isBlur: false,
            teacher: {},
            student: {},
            fName: [],
            files: [],
            text: '',
            post: []    
        }
    },
    methods:{
        add(){
            this.isAdd = !this.isAdd
            this.isNew = !this.isNew
        },
        blur(){
            this.isBlur = !this.isBlur
        },
        myFiles(files){
            for(var f=0; f<files.length; f++){
                this.fName.push(files[f].name)
                this.files.push(files[f])
            }
        },
        removeFile(fileName){
            for(var f=0; f<this.files.length; f++){
                if(fileName == this.files[f].name){
                    this.fName.splice(f, 1)
                    this.files.splice(f, 1)
                }
            }
        },
        newPost(){
            if(this.files.length > 0){
                let formData = new FormData()
                for( var i = 0; i < this.files.length; i++ ){
                    let file = this.files[i];
                    formData.append('files', file);
                }

                api().post('postFile',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                    )
                    .catch(function(err){
                    console.log(err)
                    })
            }
            api().post('newPost', {
                cId: this.$cookies.get('class').cId,
                uId: this.$store.getters.user.id,
                text: this.text,
                file: this.fName
            }).then((result) => {
                if(result.data.success){
                    this.$router.go() 
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        ...mapActions(['getUser']),
        async getAClass(){
            await api().post('aClass/'+this.$cookies.get('class').cId).then((result) => {
                if(result){
                    this.teacher = result.data.myClass.teacher
                    this.student = result.data.myClass.student
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        getPost(){
            api().post('getPost/'+this.$cookies.get('class').cId)
            .then((result) => {               
                for(var p in result.data.post){
                    this.post.unshift(result.data.post[p])
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
            await this.getPost()

            let haveThisUser = false
            for(var st in this.student){
                if(this.student[st] == this.$store.getters.user.id){
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
    },
    computed:{
        toDisable(){
            if(this.text || this.fName.length > 0){
                return false
            }else{
                return true
            }
        },
        isTeacher(){          
            return this.$cookies.get('userState')
        }
    }
}
</script>

<style scoped>
.new{
    margin: auto;
    margin-top: 20px;
    width: 60%;
    border: 1px solid #707070;
    color: #707070;
    padding: 10px 20px;
    border-radius: 12px;
    display: flex;
    align-items: center;
}

.new span{
    font-size: 14px;
    margin-left: 10px;
}

.add{
    margin: auto;
    margin-top: 20px;
    width: 60%;
    border: 1px solid #707070;
    padding: 10px 20px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
}

.add textarea{
    margin: auto;
    width: 100%;
    height: 50%;
    border: 1px solid #707070;
    color: #707070;
    padding: 10px 20px;
    border-radius: 12px;
    font-size: 14px;
    resize: none;
}

.add .btn{
    display: flex;
    justify-content: space-between;
    padding: 0px;
    margin-top: 20px;
}

.empty{
    border-radius: 20px;
    opacity: 0.6;
    min-width: 300px;
    margin-top: 50px;
}

h5{
    color: #707070;
}
/* @media(max-width: 1100px) {
    .add, .new{
        width: 70%;
    }
}

@media(max-width: 1000px) {
    .add, .new{
        width: 80%;
    }
} */
</style>