<template>
    <div v-if="cmt">
        <div class="blur position-fixed" @click="more" v-show="isMore"></div>
        <div class="comment">
            <div class="head">
                <profile :path="person.profile"/>
                <div class="name">
                    <span class="font-weight-bold">{{ person.username }}</span>
                    <br>
                    <span class="time">{{ cmt.datetime }}</span>
                </div>
                <fa v-show="canDelete" @click="more" class="moreBtn" icon="ellipsis-v"/>
                <div v-show="isMore" class="more">
                    <button @click="deleteCmt">Delete</button>
                </div>
            </div>
            <div class="body">
                <span class="text">{{ cmt.text }}</span>
            </div>
        </div>
    </div>
    
</template>

<script>
import api from "../services/api"
export default {
    props:['cmt'],
    data(){
        return{
            isMore: false,
            person: {}
        }
    },
    methods:{
        more(){
            this.isMore = !this.isMore
        },
        getPerson(){
            api().post('getPerson/'+this.cmt.userId).then((result) => {
                if(result){
                    this.person = result.data.person
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        deleteCmt(){
            api().delete('deleteCmt/'+this.cmt._id).then((result) => {
                if(result.data.success){
                    this.$emit('deleteCmt')
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    },
    async created() {
        if(this.cmt){
            await this.getPerson()
        }
    },
    computed:{
        canDelete(){
            if(this.cmt.userId == this.$store.getters.user.id || this.$cookies.get('userState')=='true'){
                return true
            }else{
                return false
            }
        }
    }
}
</script>

<style scoped>
.blur{
    position: absolute;
    left: -500%;
    top: -300%;
    width: 1200%;
    height: 1000%;
    background-color: ffffff00;
    z-index: 1;
}
.comment{
    margin-bottom: 10px;
    position: relative;
}
.comment .head{
    display: flex;
    align-items: center;
}

.comment .head .name{
    margin-left: 10px;
    line-height: 18px;
    font-size: 14px;
    color: #707070;
}

.comment .head .name .time{
    font-size: 12px;
}

.comment .head .moreBtn{
    color: #707070;
    font-size: 16px;
    position: absolute;
    top: 10px;
    right: 10px;
}

.more{
    position: absolute;
    top: 30px;
    right: -70px;
    z-index: 1;
    box-shadow: 0px 0px 4px 0px #707070;
    border-radius: 10px;
    padding: 6px 12px;
    background-color: white;
}
.more button{
    border: none;
    background-color: white;
    color: #707070;
    font-weight: bold;
    font-size: 15px;
}

.body{
    padding: 5px;
}
</style>