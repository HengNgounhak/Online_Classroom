<template>
    <div>
        <div class="header">
            <h3>The Class</h3>
            <router-link to="/assignment"><button id="back"><fa icon="angle-left"/> Back</button></router-link>
        </div>            
        <div class="body">
            <div class="assign">
                <div class="head">
                    <h3>{{ assignment.title }}</h3>
                    <span>Due to {{ assignment.dateline }}</span>
                </div>
                <p> {{ assignment.description }} </p>
                <file-upload v-for="(f, index) in assignment.file" :key="index" :fileName="f" @donwload="donwload"/>
                <br>
                <br>                
                <label class="font-weight-bold">Comment</label>
                <comment v-for="(c, index) in allCmt" :key="index" :cmt="c" @deleteCmt="deleteCmt"/>
                <write-comment @commentText="newCmt"/>
            </div>
            <form v-if="!isTeacher" class="summit" @submit.prevent="submit">
                <h4>Your work</h4>
                <div class="score">
                    <p>Score</p>
                    <span>{{score}}/{{assignment.score}}</span>
                </div>
                <br><br>
                <textarea v-model="text" placeholder="Text..." :disabled="disabled"></textarea>
                <br>
                <file-upload @removeFile="removeFile" v-for="(f, index) in fName" :key="index" :fileName="f" :haveRemove="true" :disabled="disabled" style="width: 100%"/>
                <br>
                <btn-upload @getFile="myFiles" idfile="summitFile" text="Upload File" color="#707070" padding="6px 25px" :disabled="disabled"/>
                <br>
                <div class="text-center mt-5">
                    <btn v-if="disabled" text="Unsummit" @click="unsubmit" padding="8px 30px" size="18px"/>
                    <btn v-else text="Summit" :summit='true' padding="8px 30px" size="18px" :disabled="ableSubmit"/>
                </div>
                <p class="text-center text-danger mt-2" v-if="disabled && mySubmit && mySubmit.submitAt != 'Submitted'"><small>{{ mySubmit.submitAt }}</small></p>
                <br>
                <label class="font-weight-bold">Feed back</label>
                <comment v-for="(f, index) in allFeedback" :key="index" :cmt="f"/>
            </form>
        </div>
    </div>
</template>

<script>
import BtnUpload from '../components/BtnUpload.vue'
import Comment from '../components/Comment.vue'
import FileUpload from '../components/fileUpload.vue'
import WriteComment from '../components/writeComment.vue'
import {mapActions} from 'vuex'
import api from '../services/api'
import axios from 'axios'

export default {
    components: { Comment, WriteComment, FileUpload, BtnUpload },
    data() {
        return {
            teacher: {},
            student: {},
            assignment: {},
            allCmt: [],
            allFeedback: [],
            text: '',
            fName: [],
            files: [],
            submitAt: '',
            mySubmit:'',
            disabled: false
        }
    },
    methods:{
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
        async getAassignment(){
            await api().post('getAassignment/'+this.$route.params.assignmentId).then((result) => {
                if(result){
                    this.assignment = result.data.assignment
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        donwload(name){
            axios({
                url: 'http://localhost:4000/' + name,
                method: 'GET',
                responseType: 'blob',
            }).then((response) => {
                var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                var fileLink = document.createElement('a');

                fileLink.href = fileURL;
                fileLink.setAttribute('download', name);
                document.body.appendChild(fileLink);

                fileLink.click();
            });
        },
        newCmt(cmt){
            api().post('newComment',{
                postId: this.$route.params.assignmentId,
                userId: this.$store.getters.user.id,
                text: cmt
            }).then((result) => {
                if(result.data.success){
                    this.getCmt()
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        getFeedback(){
            if(this.mySubmit){
                api().post('getComment/'+this.mySubmit._id).then((result) => {
                    this.allFeedback = result.data.comment
                }).catch((err) => {
                    console.log(err)
                })
            }
        },
        getCmt(){
            api().post('getComment/'+this.$route.params.assignmentId).then((result) => {
                this.allCmt = result.data.comment
            }).catch((err) => {
                console.log(err)
            })
        },
        deleteCmt(){
            this.getCmt()            
        },
        myFiles(files){
            for(var f=0; f<files.length; f++){
                this.fName.push(files[f].name)
                this.files.push(files[f])
            }
        },
        removeFile(fileName){
            for(var f=0; f<this.fName.length; f++){
                if(fileName == this.fName[f]){
                    this.fName.splice(f, 1)
                    this.files.splice(f, 1)
                }
            }
        },
        async submit(){
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            var datetime = this.assignment.dateline

            //to get months in number
            var mm = datetime.substring(0, 3)
            for(var m=0; m<months.length; m++){
                if(mm == months[m]){
                    mm = m
                    break
                }
            }
            if(mm<10){
                mm='0'+mm
            } 

            //covert am pm to 24 hour 
            var hour = datetime.substring(datetime.length-2, datetime.length) == "PM" ? Number(datetime.substring(13, 15)) + 12 : Number(datetime.substring(13, 15));
            
            //check if submit date time is on the datelin
            var dateline = new Date(datetime.substring(8, 12), mm, datetime.substring(5, 7), hour, datetime.substring(16, 18))
            var currdt = new Date();

            var suffix = currdt.getHours() >= 12 ? "PM":"AM";
            var hh = currdt.getHours() > 12 ? currdt.getHours() - 12 : currdt.getHours();
            var min = currdt.getMinutes()
            if(hh<10){
                hh='0'+hh
            } 
            if(min<10){
                min='0'+min
            }
            if (dateline >= currdt) {
                this.submitAt = 'Submitted'
            }else{
                this.submitAt = 'Submitted at ' + months[Number(currdt.getMonth())] +", "+currdt.getDate()+" "+currdt.getFullYear()+" "+hh+":"+min+" "+suffix
            } 

            //delete old submit for resubmit
            if(this.mySubmit){
                await api().post('deleteSubmit', {
                    assignmentId: this.mySubmit.assignmentId,
                    userId: this.mySubmit.userId
                }).catch((err) => {
                    console.log(err)
                })
            }

            //if have file send file
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
            
            api().post('newSubmit', {
                assignmentId: this.$route.params.assignmentId,
                userId: this.$store.getters.user.id,
                text: this.text,
                submitAt: this.submitAt,
                file: this.fName
            }).then((result) => {
                if(result.data.success){
                    this.$router.go() 
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        async getAsubmit(){
            await api().post('getAsubmit', {
                assignmentId: this.$route.params.assignmentId,
                userId: this.$store.getters.user.id
            }).then((result) => {
                if(result.data.Submit){
                    this.mySubmit = result.data.Submit
                    this.text = this.mySubmit.text
                    this.fName = this.mySubmit.file
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        unsubmit(){
            this.disabled = false
        }
    },
    async created() {
        //prevent this page for not login
        if(!this.$cookies.get('token')){
            this.$router.push({name: 'signin'}) 
        }else{           
            await this.getUser(this.$cookies.get('token'))
            await this.getAClass()
            await this.getAassignment()
            await this.getCmt()
            await this.getAsubmit()
            await this.getFeedback()
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

        //to disable edit submition
        if(this.mySubmit){
            this.disabled = true
        }else{
            this.disabled = false
        }
    },
    computed:{
        score(){
            if(this.mySubmit.score>0){
                return this.mySubmit.score
            }
            return 0
        },
        isTeacher(){
            if(this.$cookies.get('userState') == 'true'){
                return true
            }
            return false
        },
        ableSubmit(){
            if(this.text||this.fName.length>0){
                return false
            }
            return true
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
.body{
    display: flex;
    padding: 40px 20px 0px 40px;
    color: #707070;
}
.assign{
    flex: 8;
    padding: 0 40px;
}
.assign .head{
    display: flex;
    justify-content: space-between;
    align-items: baseline;
}
.assign .head span{
    font-size: 15px;
    color: #1177BE;
    font-weight: bold;
}

.assign p{
    margin-top: 20px;
    text-align: justify;
}

.summit{
    flex: 4;
    box-shadow: 0px 0px 8px 0px #707070;
    border-radius: 15px;
    padding: 40px;
    position: relative;
    margin-bottom: 20px;
}

.summit .score{
    position: absolute;
    top: 43px;
    right: 40px;
    text-align: right;
    font-weight: bold;
    font-size: 15px;
}

.summit .score p{
    color: #1177BE;
    font-size: 18px;
    margin-bottom: 3px;
}

.summit textarea{
    width: 100%;
    border: 1px solid#707070;
    height: 40px;
    border-radius: 20px;
    resize: none;
    padding: 7px 20px;
    color: #707070;
    margin-bottom: 10px;
}
@media(max-width: 800px) {
    .body{
        flex-direction: column;
    }
    .summit{
        margin: 40px;
    }
}
</style>