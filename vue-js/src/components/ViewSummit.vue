<template>
    <div class="view">
        <blur bdcolor="#9F9F9F" v-show="isGrade" @click="isGrade = !isGrade"/>
        <div>
            <button @click="$emit('isBack')"><fa icon="angle-left"/> Back</button>
        </div>
        <table width="100%" class="mt-4">
            <tr id="th">
                <td width="45%" class="pb-2">Student Name</td>
                <td width="35%" class="text-center pb-2">Status</td>
                <td width="20%" class="text-right pb-2">Score</td>
            </tr>
            <tr-view-summit @toGrade="grade" v-for="(s, index) in student" :key="index" :student="s" :aId="aId"/>
        </table> 
        <grade-model :submit="submit" :aStudent="aStudent" v-show="isGrade" @closeGrade="isGrade = !isGrade"/>   
    </div>
</template>

<script>
import GradeModel from './gradeModel.vue'
import trViewSummit from './trViewSummit.vue'
export default {
    components: { trViewSummit, GradeModel },
    props: ['student', 'aId'],
    data(){
        return{
            isGrade: false,
            submit: '',
            aStudent: ''
        }
    },
    methods: {
        grade(submit, aStudent){
            this.submit = submit
            this.aStudent = aStudent
            if(submit&&aStudent){
                this.isGrade = !this.isGrade
            }
        }
    }
}
</script>

<style scoped>
.view{
    width: 60%;
    margin: auto;
    margin-top: 20px;
}

button{
    font-weight: bold;
    background-color: white;
    border: none;
    color: #1177BE;
    font-size: 18px;
}

#th{
    width: 100%;
    font-weight: bold;
    border-bottom: 2px solid #707070;
    color: #707070;
}
</style>