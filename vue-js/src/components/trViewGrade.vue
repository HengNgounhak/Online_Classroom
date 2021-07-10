<template>
    <tr>
        <td class="font-weight-bold">
            {{assignment.title}}
        </td>
        <td v-if="isSubmit != 'Submitted'" class="text-center text-danger">{{isSubmit}}</td>
        <td v-else class="text-center">{{isSubmit}}</td>
        <td class="text-center">{{assignment.dateline}}</td>
        <td class="text-right font-weight-bold">{{score}}/{{assignment.score}}</td>
    </tr>     
</template>

<script>
import api from '../services/api'
export default {
    props:["assignment"],
    data() {
        return {
            aSubmit: ''
        }
    },
    methods: {
        getAsubmit(){
            if(this.assignment){
                api().post('getAsubmit',{
                    assignmentId: this.assignment._id,
                    userId: this.$store.getters.user.id 
                }).then((result) => {
                    if(result.data.Submit){
                        this.aSubmit = result.data.Submit
                    }else{
                        this.aSubmit = ''
                    }
                })
            }
            
        }
    },
    async created() {
        await this.getAsubmit()
    },
    computed:{
        isSubmit(){
            if(this.aSubmit){
                return this.aSubmit.submitAt
            }
            return '-'
        },
        score(){
            if(this.aSubmit.score>0){
                return this.aSubmit.score
            }
            return 0
        }
        
    }
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