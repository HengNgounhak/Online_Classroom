<template>
    <div>
        <div v-if="aStudent && submit" class="main">
            <fa class="exit" icon="times" @click="$emit('closeGrade')"/>
            <div class="head">
                <profile size="42px" :path="aStudent.profile"/>
                <div class="name">
                    <span class="font-weight-bold">{{aStudent.username}}</span>
                    <br>
                    <span class="time">{{submit.submitAt}}</span>
                </div>
            </div>
            <div class="body">
                <p class="text-justify">{{submit.text}}</p>
            </div>
            <FileUpload v-for="(f, i) in submit.file" :key="i" :fileName="f"/>
            <label class="font-weight-bold mt-4 mb-0">Feed back</label>
            <comment v-for="(c, index) in allCmt" :key="index" :cmt="c" @deleteCmt="deleteCmt"/>
            <write-comment @commentText="newCmt"/>
            <div class="score text-right mt-4">
                <span>Score</span><br>
                <input v-model="score" type="number" min="0">
            </div>
            <div class="btn">
                <btn @click="$emit('closeGrade')" text="Cancel" size="14px" padding="5px 15px"/>
                <div class="right">
                    <btn @click="grade" text="Grade" size="14px" padding="5px 15px"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FileUpload from './fileUpload.vue'
import WriteComment from './writeComment.vue'
import api from '../services/api'
import Comment from './Comment.vue'
export default {
    components: { WriteComment, FileUpload, Comment },
    props: ["submit", "aStudent"],
    data() {
        return {
            score: '',
            allCmt: []
        }
    },
    methods: {
        grade(){
            api().post('gradeSubmit',{
                submitId: this.submit._id,
                score: this.score
            }).then((result) => {
                if(result.data.success){
                    this.$emit('closeGrade')
                }
            })
        },
        newCmt(cmt){
            api().post('newComment',{
                postId: this.submit._id,
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
        getCmt(){
            api().post('getComment/'+this.submit._id).then((result) => {
                this.allCmt = result.data.comment
            }).catch((err) => {
                console.log(err)
            })
        },
        deleteCmt(){
            this.getCmt()
        }
    },
    async created() {
        await this.getCmt()
    },
}
</script>

<style scoped>
.main{
    border: 1px solid #707070;
    border-radius: 15px;
    padding: 20px 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    width: 550px;
    color: #707070;
    background-color: white;
}
.main .exit{
  position: absolute;
  right: 15px;
  top: 10px;
  font-size: 18px;
  color: #707070;
}
.main .head{
    display: flex;
    align-items: center;
    position: relative;
}

.main .head .name{
    margin-left: 10px;
    line-height: 18px;
    font-size: 14px;
    color: #707070;
}

.main .head .name .time{
    font-size: 12px;
}

.main .body{
    font-size: 14px;
    margin-top: 10px;
}

.main .score span{
    font-weight: bold;
    color: #1177BE;
}

.main .score input{
    border: none;
    border-bottom: 1px solid #707070;
    width: 100px;
    color: #707070;
}

.main .btn{
    display: flex;
    justify-content: space-between;
    padding: 0px;
    margin-top: 20px;
}

</style>