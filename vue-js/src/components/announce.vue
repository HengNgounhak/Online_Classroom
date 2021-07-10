<template>
    <div>
        <blur v-show="isMore" @click="more"/>
        <blur v-show="isComment" @click="comment" bdcolor="#9F9F9F"/>
        <div class="announce">
            <div class="main">
                <div class="head">
                    <profile size="42px" :path="person.profile"/>
                    <div class="name">
                        <span class="font-weight-bold">{{person.username}}</span>
                        <br>
                        <span class="time">{{myPost.datetime}}</span>
                    </div>
                    <fa v-if="isTeacher == 'true'" @click="more" class="moreBtn" icon="ellipsis-v"/>
                    <div v-show="isMore" class="more">
                        <button @click="deletePost">Delete</button>
                    </div>
                </div>
                <div class="body">
                    <p class="text-justify">{{myPost.text}}</p>
                </div>
                <file-upload v-for="(f, index) in myPost.file" :key="index" :fileName="f" @donwload="donwload"/>
            </div>
            <button class="comment" @click="comment"><fa class="icon" icon='comment'/> {{ numComment }} Comments</button>
            <announce-comment :postId="myPost._id" v-show="isComment" @closeComment="comment" @numCmt="numCmt"/>
        </div>
    </div>
</template>

<script>
import AnnounceComment from './announceComment.vue'
import FileUpload from './fileUpload.vue'
import api from '../services/api'
import axios from 'axios'
export default {
    props: ['myPost'],
    components: { FileUpload, AnnounceComment },
    data(){
        return{
            isMore: false,
            isComment: false,
            person: [],
            numComment: 0
        }
    },
    methods:{
        more(){
            this.isMore = !this.isMore
        },
        comment(){
            this.isComment = !this.isComment
            this.$emit('comment')
        },
        getPerson(){
            api().post('getPerson/'+this.myPost.uId).then((result) => {
                if(result){
                    this.person = result.data.person
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        donwload(name){
            axios({
                url: 'http://localhost:4000/' + name,
                method: 'GET',
                responseType: 'blob',
            }).then((response) => {
                var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                var fileLink = document.createElement('a');

                fileLink.href = fileURL;
                fileLink.setAttribute('download', name);
                document.body.appendChild(fileLink);

                fileLink.click();
            });
        },
        deletePost(){
            api().delete('deletePost/'+this.myPost._id).then((result) => {
                if(result.data.success){
                    this.$router.go()
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        numCmt(num){
            this.numComment = num
        }
    },
    async created() {
        await this.getPerson()
    },
    computed:{
        isTeacher(){
            return this.$cookies.get('userState')
        }
    }
}
</script>

<style scoped>
.announce{
    width: 60%;
    border: 1px solid #707070;
    border-radius: 15px;
    margin: auto;
    margin-top: 10px;
}
.announce .main{
    border-bottom: 1px solid #707070;
    border-radius: 15px;
    padding: 20px;
    position: relative;
}

.announce .main .head{
    display: flex;
    align-items: center;
}

.announce .main .head .name{
    margin-left: 10px;
    line-height: 18px;
    font-size: 14px;
    color: #707070;
}

.announce .main .head .name .time{
    font-size: 12px;
}

.announce .main .head .moreBtn{
    color: #707070;
    font-size: 20px;
    position: absolute;
    top: 20px;
    right: 20px;
}

.announce .main .head .more{
    box-shadow: 0px 0px 4px 0px #707070;
    border-radius: 10px;
    padding: 6px 12px;
    background-color: white;
    position: absolute;
    top: 45px;
    right: -60px;
    z-index: 1;
}
.announce .main .head .more button{
    border: none;
    background-color: white;
    color: #707070;
    font-weight: bold;
    font-size: 15px;
}

.announce .main .body{
    font-size: 14px;
    margin-top: 10px;
}

.comment{
    background-color: white;
    border: none;
    font-size: 14px;
    color: #1177BE;
    font-weight: bold;
    margin: 5px 20px;
}

.comment .icon{
    font-size: 24px;
}

/* @media(max-width: 1100px) {
    .announce{
        width: 70%;
    }
} */

/* @media(max-width: 1000px) {
    .announce{
        width: 80%;
    }
} */

</style>