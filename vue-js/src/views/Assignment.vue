<template>
    <div>
        <class-bar />
        <btn-home />
        <div class="assignment" v-show="isAssignment">
            <div v-if="!isTeacher && allAssignment.length>0" class="text-right">
                <btn @click="viewGrade" text="View Grade" size="14px" padding="8px 20px"/>
            </div>
            <div v-if="isTeacher" class="new" @click="add" v-show="isNew">
                <span>New assignment</span><fa icon="plus" />
            </div>
            <new-assignment idInputFile="newAssignment" idInputDate="assignmentDatelin" v-show="isAdd" @cancel="add"/>
            <assignment-item v-for="(a, index) in allAssignment" :key="index" :assignment="a" @toViewSummit="viewSummit"/>
            <div v-if="allAssignment.length<1" class="text-center">
            <img class="empty w-50" src="../assets/emptyAssignment.png">
            <h5 class="mt-3">No assignment</h5>
        </div>
        </div>
        <view-summit v-show="isViewSummit" @isBack="viewSummit" :aId="aId" :student="student"/>
        <view-grade v-show="isViewGrade" @isBack="viewGrade" :assignment="allAssignment"/>
    </div>
    
</template>

<script>
import AssignmentItem from '../components/assignmentItem.vue'
import BtnHome from '../components/BtnHome.vue'
import ClassBar from '../components/ClassBar.vue'
import NewAssignment from '../components/newAssignment.vue'
import ViewGrade from '../components/ViewGrade.vue'
import ViewSummit from '../components/ViewSummit.vue'
import {mapActions} from 'vuex'
import api from '../services/api'

export default {
    components: { ClassBar, BtnHome, AssignmentItem, NewAssignment, ViewSummit, ViewGrade },
    data(){
        return{
            isAssignment: true,
            isViewSummit: false,
            isViewGrade: false,
            isAdd: false,
            isNew: true,
            teacher: {},
            student: [],
            allAssignment: [],
            aId: ''           
        }
    },
    methods:{
        viewSummit(aId){
            this.isAssignment = !this.isAssignment
            this.isViewSummit = !this.isViewSummit
            this.aId = aId
        },
        viewGrade(){
            this.isAssignment = !this.isAssignment
            this.isViewGrade = !this.isViewGrade
        },
        add(){
            this.isAdd = !this.isAdd
            this.isNew = !this.isNew
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
        getAssignment(){
            api().post('getAssignment/'+this.$cookies.get('class').cId).then((result) => {
                if(result){
                    for(var i in result.data.assignment){
                        this.allAssignment.unshift(result.data.assignment[i])
                    }
                    
                }
            })
        }
    },
    computed:{
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
            await this.getAssignment()

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
.assignment{
    width: 60%;
    margin: auto;
    margin-top: 20px;
    position: relative;
}

.new{
    margin-top: 20px;
    border: 1px solid #707070;
    color: #1177BE;
    padding: 15px 25px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: bold;
}

a{
  text-decoration: none;
}

.empty{
    border-radius: 20px;
    opacity: 0.8;
    min-width: 300px;
    margin-top: 20px;
}

h5{
    color: #707070;
}
</style>