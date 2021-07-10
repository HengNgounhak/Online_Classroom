<template>
    <tr @click="$emit('toGrade', aSubmit, aStudent)">
        <td class="d-flex flex-wrap align-items-center justify-content-center">
            <div class="text-center">
                <profile class="mr-2" :path="aStudent.profile"/> 
            </div>
            <span class="flex-grow-1">{{aStudent.username}}</span>
            </td>
        <td v-if="aSubmit && aSubmit.submitAt != 'Submitted'" class="text-center text-danger">{{isSubmit}}</td>
        <td v-else class="text-center">{{isSubmit}}</td>
        <td class="text-right font-weight-bold">{{score}}/{{assignment.score}}</td>
    </tr>     
</template>

<script>
import api from '../services/api'
export default {
    props: ['student', 'aId'],
    data() {
        return {
            aStudent: '',
            aSubmit: '',
            assignment: '',
            propsStudent: this.student
            // myAid: this.aId
        }
    },
    methods: {
        getAstudent(){
            if(this.student){
                api().post('getPerson/'+this.student).then((result) => {
                    if(result.data.person){
                        this.aStudent = result.data.person
                    }
                })
            }
            
        },
        getAsubmit(){
            if(this.aId&&this.student){
                api().post('getAsubmit',{
                    assignmentId: this.aId,
                    userId: this.student 
                }).then((result) => {
                    if(result.data.Submit){
                        this.aSubmit = result.data.Submit
                    }else{
                        this.aSubmit = ''
                    }
                })
            }
            
        },
        async getAassignment(){
            if(this.aId){
                await api().post('getAassignment/'+this.aId).then((result) => {
                    if(result){
                        this.assignment = result.data.assignment
                    }
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
    },
    computed:{
        isSubmit(){
            if(this.aId){
                this.getAsubmit()
                this.getAstudent()
                this.getAassignment()
            }

            if(this.aSubmit){
                return this.aSubmit.submitAt
            }
            return '-'
        },
        score(){
            if(this.aSubmit.score>0){
                return this.aSubmit.score
            }
            return '-'
        }
        
    },
    // watch:{
    //     myAid(){
    //         if(this.myAid){
    //             this.getAsubmit()
    //             this.getAstudent()
    //             this.getAassignment()
    //         }
            
    //     }
    // }
}
</script>

<style scoped>
tr{
    border-bottom: 1px solid #70707020;
    padding: 20px 0px;
    color: #707070;
    font-size: 14px;
}
td{
    padding: 10px 0px;
}
td:nth-child(even){
    color: #1177BE;
}
tr:hover{
    background-color: #70707020;
}
</style>