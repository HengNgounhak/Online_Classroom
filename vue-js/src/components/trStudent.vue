<template>
    <div>
        <blur v-show="isMore" @click="more"/>
        <tr>
            <profile :path="person.profile"/><span class="ml-2">{{person.username}}</span>
            <fa v-show="isTeacher" @click="more" class="moreBtn" icon="ellipsis-h"/>
            <div v-show="isMore" class="more">
                <button @click="removeFromClass">Remove</button>
                <br>
                <button @click="makeAsTeacher">Make as teacher</button>
            </div>
        </tr>
    </div>
    
</template>

<script>
import api from '../services/api'
export default {
    props:["sId", "noMore"],
    data(){
        return{
            isMore: false,
            person: []
        }
    },
    methods:{
        more(){
            this.isMore = !this.isMore
        },
        removeFromClass(){
            api().put('leaveClass/'+this.$cookies.get('class').cId,{
                sId: this.sId
            }).then((result) => {
                if(result.data.success){
                    this.$router.go()
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        makeAsTeacher(){
            api().put('leaveClass/'+this.$cookies.get('class').cId,{
                sId: this.sId,
                makeAsTeacher: true
            }).then((result) => {
                if(result.data.success){
                    this.$router.go()
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    },
    computed: {
        isTeacher(){
            if(this.noMore){
                return false
            }else{
                var set = (this.$cookies.get('userState') === 'true')
                return set
            }
        }        
    },
    async created() {
        await api().post('getPerson/'+this.sId
        ).then((result) => {
            this.person = result.data.person
        }).catch((err) => {
            console.log(err)
        })
    },

}
</script>

<style scoped>
tr{
    display: flex;
    align-items: center;
    position: relative;
    border-bottom: 1px solid #70707020;
    padding: 10px 0px;
    color: #707070;
}

tr:hover{
    background-color: #70707020;
}

.moreBtn{
    font-size: 16px;
    position: absolute;
    top: 40%;
    right: 10px;
}

.more{
    position: absolute;
    top: 40px;
    right: -110px;
    z-index: 1;
    box-shadow: 0px 0px 4px 0px #707070;
    border-radius: 10px;
    padding: 12px;
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
</style>