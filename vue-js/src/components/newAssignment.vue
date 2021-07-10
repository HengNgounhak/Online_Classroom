<template>
    <form @submit.prevent="newAssignment" class="add">
        <input v-model="title" type="text" placeholder="Title" required>
        <textarea v-model="description" placeholder="Description"></textarea>
        <div id="rowInput">
            <div>
                <label>Score</label><br>
                <input v-model="score" class="w-75" type="number" min="1" required>
            </div>
            <div>
                <label>Due to</label><br>
                <input @change="checkDatetime" v-model="date" :id="idInputDate" class="mr-3 mb-2" type="date" @click="mindate" required>
                <input @change="checkDatetime" v-model="time" type="time">
                <p v-show="errDatetime">Incorrect datatime (should not set in the past)</p>
            </div>
        </div>
        <file-upload @removeFile="removeFile" v-for="(f, index) in fName" :key="index" :fileName="f" :haveRemove="true"/>
        <div class="btn">
            <btn-upload @getFile="myFiles" :idfile="idInputFile" text="Upload" color="#707070" size="14px" padding="5px 15px"/>
            <div class="right">
                <btn @click="$emit('cancel')" text="Cancel" size="14px" padding="5px 15px"/>
                <btn class="ml-2" text="Post" size="14px" padding="5px 15px" :summit='true'/>
            </div>
        </div>
    </form>
</template>

<script>
import BtnUpload from './BtnUpload.vue'
import FileUpload from './fileUpload.vue'
import api from '../services/api'

export default {
    props:['editAssignment', 'idInputFile', 'idInputDate'],
    components: { BtnUpload, FileUpload },
    data() {
        return { 
            title: '',
            description: '',
            date: '',
            time: '23:59',
            errDatetime: false,
            score: 100,
            fName: [],
            files: [],
            datetime: '',
            myAssignment: ''
        }
    },
    methods: {
        mindate(){
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0 so need to add 1 to make it 1!
            var yyyy = today.getFullYear();
            if(dd<10){
                dd='0'+dd
            } 
            if(mm<10){
                mm='0'+mm
            } 

            today = yyyy+'-'+mm+'-'+dd;
            if(!this.myAssignment){
                document.getElementById(this.idInputDate).setAttribute("min", today); 
            }
        },
        checkDatetime(){
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            var arrdate= this.date.split("-")
            var arrtime= this.time.split(":")

            //covert to mmm, dd yyyy format
            var suffix = arrtime[0] >= 12 ? "PM":"AM";
            var hour = arrtime[0] > 12 ? arrtime[0] - 12 : arrtime[0];
            if(hour<10){
                hour='0'+hour
            } 
            this.datetime = months[Number(arrdate[1])-1] +", "+ arrdate[2] + " " + arrdate[0] +" "+ hour+":"+arrtime[1]+" "+suffix
            
            //check if input date time is in the past
            var userdt = new Date(arrdate[0], arrdate[1] - 1, arrdate[2],arrtime[0],arrtime[1])

            var currdt = new Date();
            if (userdt < currdt) {
                this.errDatetime = true
            }else{
                this.errDatetime = false
            }
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
        newAssignment(){
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

            if(this.errDatetime == false){
                if(this.editAssignment){
                    api().post('editAssignment', {
                        assignmentId: this.editAssignment,
                        title: this.title,
                        description: this.description,
                        file: this.fName,
                        dateline: this.datetime,
                        score: this.score
                    }).then((result) => {
                        console.log(result.data.success)
                        if(result.data.success){
                            this.$router.go() 
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                }else{
                    api().post('newAssignment', {
                        cId: this.$cookies.get('class').cId,
                        title: this.title,
                        description: this.description,
                        file: this.fName,
                        dateline: this.datetime,
                        score: this.score
                    }).then((result) => {
                        if(result.data.success){
                            this.$router.go() 
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                }
                
            }
        },
        async getAassignment(){
            await api().post('getAassignment/'+this.editAssignment).then((result) => {
                if(result.data.assignment){
                    this.myAssignment = result.data.assignment
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    },
    async created() {
        if(this.editAssignment){
            await this.getAassignment()
            this.title = this.myAssignment.title
            this.description = this.myAssignment.description
            this.fName = this.myAssignment.file
            this.score = this.myAssignment.score

            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            var dt = this.myAssignment.dateline
            //to get months in number
            var mm = dt.substring(0, 3)
            for(var m=0; m<months.length; m++){
                if(mm == months[m]){
                    mm = m+1
                    break
                }
            }
            if(mm<10){
                mm='0'+mm
            } 
            //covert am pm to 24 hour 
            var hour = dt.substring(dt.length-2, dt.length) == "AM" ? parseInt(dt.substring(13, 15)) + 12 : dt.substring(13, 15);
            this.date = dt.substring(8, 12)+'-'+mm+'-'+dt.substring(5, 7)
            this.time = hour+":"+dt.substring(16, 18)
            this.checkDatetime()
        }
    }
}
</script>

<style scoped>
.add{
    margin-top: 20px;
    border: 1px solid #707070;
    padding: 20px 20px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
}
.add input{
    border: 1px solid #707070;
    color: #707070;
    padding: 6px 20px;
    border-radius: 12px;
    font-size: 14px;
}
.add textarea{
    margin: 10px 0px;
    width: 100%;
    height: 50%;
    border: 1px solid #707070;
    color: #707070;
    padding: 10px 20px;
    border-radius: 12px;
    font-size: 14px;
    resize: none;
}

.add #rowInput {
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: flex-start;
    color: #707070;
}

.add .btn{
    display: flex;
    justify-content: space-between;
    padding: 0px;
    margin-top: 20px;
}

p{
    color: red;
    font-size: 14px;
    margin: 0px;
    font-weight: normal;
}

</style>