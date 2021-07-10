<template>
    <div>
        <class-bar/>
        <btn-home/>
        <blur bdcolor="#9F9F9F" v-if="fName.length>0"/>
        <div class="file">
            <div class="head">
                <button v-show="isTeacher" @click="newBtn"><fa icon="plus" /> New</button>
                <input ref="files" @change="onFileChange" type="file" name="idfile" id="idfile" style="display:none;" multiple>
            </div>
            <file-model v-if="fName.length>0" :fName="fName" @removeFile="removeFile" @upload="newFile" @closeUpload="closeUpload"/>
            <table>
                <tr class="thTable">
                    <th>Name</th>
                    <th>Modified</th>
                </tr>
            </table>
            <tr-file v-for="(f, i) in myfiles" :key="i" :file="f"/>
            <div v-if="myfiles.length<1" class="text-center">
                <img class="empty" src="../assets/emptyFile.png">
                <h5 class="mt-3">No file</h5>
            </div>
        </div>
    </div>
</template>

<script>
import BtnHome from '../components/BtnHome.vue'
import ClassBar from '../components/ClassBar.vue'
import TrFile from '../components/trFile.vue'
import {mapActions} from 'vuex'
import api from '../services/api'
import FileModel from '../components/fileModel.vue'

export default {
  components: { ClassBar, TrFile, BtnHome, FileModel },
    data(){
        return{
            fName: [],
            teacher: {},
            student: {},
            files: [],
            myfiles: []
        }
    },
    methods: {
        newBtn(){
            document.getElementById('idfile').click()
        },
        onFileChange(){
            for(var n=0; n<this.$refs.files.files.length ; n++){
                this.files.push(this.$refs.files.files[n])
            }
            
            for(var f=0; f<this.files.length; f++){
                this.fName.push(this.files[f].name)
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
        closeUpload(){
            this.fName = []
            this.files = []
        },
        async newFile(){
            if(this.files.length > 0){
                let formData = new FormData()
                for( var i = 0; i < this.files.length; i++ ){
                    let file = this.files[i];
                    formData.append('files', file);
                }

                await api().post('postFile',
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

            var today = new Date()
            var dd = today.getDate()
            var mm = today.getMonth()
            var yyyy = today.getFullYear()
            var hour = today.getHours()
            var min = today.getMinutes()
            if(dd<10){
                dd='0'+dd
            } 

            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

            var suffix = hour >= 12 ? "PM":"AM";
            hour = hour > 12 ? hour - 12 : hour;
            if(hour<10){
                hour='0'+hour
            } 
            var datetime = months[Number(mm)] +", "+ dd + " " + yyyy +" "+ hour +":"+min+" "+suffix

            for(var name in this.fName){
                await api().post('newFile', {
                    cId: this.$cookies.get('class').cId,
                    name: this.fName[name],
                    dateAdd: datetime
                }).catch((err) => {
                    console.log(err)
                })
            }
            this.$router.go()
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
        getFile(){
            api().get('getFile/'+this.$cookies.get('class').cId).then((result) => {
                if(result.data.file){
                    for(var i in result.data.file){
                        this.myfiles.unshift(result.data.file[i])
                    }
                }
            })
        }
    },
    computed: {
        isTeacher(){
            if(this.$cookies.get('userState') == 'true'){
                return true
            }
            return false
        }       
    },
    async created() {
        //prevent this page for not login
        if(!this.$cookies.get('token')){
            this.$router.push({name: 'signin'}) 
        }else{           
            await this.getUser(this.$cookies.get('token'))
            await this.getAClass()
            this.getFile()

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
    }
}
</script>

<style scoped>
.file{
    width: 60%;
    margin: auto;
    margin-top: 20px;
}

.head{
    text-align: end;
    position: relative;
    margin-bottom: 10px;
}
.head button{
    color: #1177BE;
    border: 1px solid #707070;
    border-radius: 25px;
    background-color: white;
    padding: 5px 20px;
    font-weight: bold;
}
.head .newBtn{
    color: #707070;
    font-size: 16px;
    position: absolute;
    top: 40px;
    right: 40px;
    text-align: start;
    box-shadow: 0px 0px 4px 0px #707070;
    border-radius: 10px;
    padding: 12px;
    background-color: white;
    z-index: 1;
}
.head .newBtn button{
    border: none;
    background-color: white;
    color: #1177BE;
    font-weight: bold;
    margin: 2px 0px;
}
table{
    width: 100%;
    margin-bottom: 10px;
}
.thTable{
    border-bottom: 2px solid #707070;
    color: #707070;
}
th{
    width: 50%;
}

.empty{
    border-radius: 20px;
    width: 25%;
    min-width: 100px;
    margin-top: 50px;
}

h5{
    color: #707070;
}
</style>