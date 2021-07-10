<template>
    <div class="position-relative">
        <blur v-show="isMore" @click="more"/>
        <blur bdcolor="#9F9F9F" v-show="isEdit" @cancel="edit"/>
        <div class="item" @click="toAssignment">
            <div class="left">
                <h6 class="text-dark font-weight-bold">{{ assignment.title }}</h6>
                <p v-if="mySubmit && !isTeacher && mySubmit.submitAt == 'Submitted'" class="submitAt mb-1">{{ mySubmit.submitAt }}</p>
                <p v-else-if="mySubmit && !isTeacher" class="text-danger mb-1">{{ mySubmit.submitAt }}</p>
                <p v-else class="mb-1">Due to {{ assignment.dateline }}</p>
            </div>
            <div v-if="isTeacher" class="right mr-4">
                <span>{{numSubmit}}/{{numStudent}}</span>
            </div>
        </div>
        <fa v-if="isTeacher" @click="more" icon="ellipsis-v" class="moreBtn ml-4"/>
        <div v-show="isMore" class="more">
            <button @click="edit">Edit</button>
            <br>
            <button @click="viewAssignment">View</button>
            <br>
            <button @click="deleteAssignment">Delete</button>
        </div>
        <div class="edit position-fixed" v-show="isEdit">
            <new-assignment :idInputDate="'Date'+assignment._id" :idInputFile="assignment._id" :editAssignment="assignment._id" @cancel="edit"/>
        </div>
    </div>
</template>

<script>
import newAssignment from './newAssignment.vue'
import api from '../services/api'
export default {
    components: { newAssignment },
    emits: ["cancel", "toViewSummit"],
    props: ["assignment"],
    data(){
        return{
            isMore: false,
            isEdit: false,
            mySubmit: '',
            submit: '',
            numStudent: 0
        }
    },
    methods:{
        more(){
            this.isMore = !this.isMore
        },
        edit(){
            this.isMore = false
            this.isEdit = !this.isEdit
        },
        toAssignment(){
            if(this.isTeacher){
                this.$emit('toViewSummit', this.assignment._id)
            }else{
                this.$router.push('/view-assignment/'+this.assignment._id)
            }
        },
        viewAssignment(){
            this.$router.push('/view-assignment/'+this.assignment._id)
        },
        async getAsubmit(){
            await api().post('getAsubmit', {
                assignmentId: this.assignment._id,
                userId: this.$store.getters.user.id
            }).then((result) => {
                if(result.data.Submit){
                    this.mySubmit = result.data.Submit
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        getSubmit(){
            api().post('getSubmit/'+this.assignment._id).then((result) => {
                if(result.data.submit){
                    this.submit = result.data.submit
                }
            })
        },
        aClass(){
            api().post('aClass/'+this.$cookies.get('class').cId).then((result) => {
                if(result.data.myClass){
                    this.numStudent = result.data.myClass.student.length
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        deleteAssignment(){
            api().delete('deleteAssignment/'+this.assignment._id).then((result) => {
                if(result.data.success){
                    this.$router.go()
                }
            })
        }
    },computed:{
        isTeacher(){
            if(this.$cookies.get('userState') == 'true'){
                return true
            }
            return false
        },
        numSubmit(){
            if(this.submit.length>0){
                return this.submit.length
            }
            return 0
        }
    },
    async created() {
        await this.getAsubmit()
        await this.getSubmit()
        await this.aClass()
    },
}
</script>

<style scoped>
.item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #707070;
    color: #707070;
    padding: 10px 25px;
    border-radius: 12px;
    position: relative;
    margin-top: 10px;
}

.left{
    line-height: 10px;
    font-size: 12px;
}

.moreBtn{
    position: absolute;
    top: 25px;
    right: 30px;
    color: #707070;
}

.more{
    position: absolute;
    top: 40px;
    right: -60px;
    z-index: 1;
    box-shadow: 0px 0px 4px 0px #707070;
    border-radius: 10px;
    padding: 12px 16px;
    background-color: white;
}
button{
    border: none;
    background-color: white;
    color: #707070;
    font-weight: bold;
    margin: 2px 0px;
    font-size: 14px;
}
.edit{
    width: 550px;
    background-color: white;
    border-radius: 15px;
    padding: 20px;
    padding-top: 0px;
    font-size: 14px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
}

.submitAt{
    color: #1177BE;
}
</style>