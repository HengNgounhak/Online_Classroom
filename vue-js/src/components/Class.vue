<template>
    <div>
        <blur v-show="isMore" @click="more"/>
        <blur bdcolor="#9F9F9F" v-show="isBlur" @click="blur"/>
        <div class="position-relative" >
            <div class="aClass" @click="toAnnounce()">
                <div class="theme">
                    <span class="cName">{{ className }}</span>
                    <div class="teacher">
                        <span>{{ myTeacher.username }}</span>
                        <span><profile :path="myTeacher.profile" color="black"/></span>
                    </div>
                </div>
            </div>
            <div @click="more"  class="moreIcon">
                <fa  icon="ellipsis-h" />
                <div v-if="teacher" class="multi" v-show="isMore">
                    <button @click="blur(), more(), isRename = true">Rename</button>
                    <br>
                    <button @click="blur(), more(), isDelete = true">Delete class</button>
                </div>
                <div v-else class="multi" v-show="isMore">
                    <button @click="blur(), isLeave = true">Leave class</button>
                </div>
            </div>
        </div>
        <home-model @inputModel="renameClass" :error="errorInput" title="Rename class" placeholder="New name..." btn="Save Change" v-show="isRename" @closeModel="blur()"/>
        <cofirm-alert @confirm="deleteClass" v-show="isDelete" @cancel="blur()" :text="'Do you want to delete '+ className +' class?'"/>
        <cofirm-alert @confirm="leaveClass" v-show="isLeave" @cancel="blur()" :text="'Do you want to leave '+ className +' class?'"/>
    </div>
</template>

<script>
import homeModel from './homeModel.vue'
import api from '../services/api'
import CofirmAlert from './cofirmAlert.vue'

export default {
    components: { homeModel, CofirmAlert },
    props: ["className", "cId", "teacherId", "cCode"],
    data(){
        return{
            isMore: false,
            isRename: false,
            isDelete: false,
            isLeave: false,
            isBlur: false,
            errorInput: '',
            myTeacher: {}
        }
    },
    methods:{
        more(){
            this.isMore = !this.isMore
        },
        blur(){
            this.isMore = false
            this.isBlur = !this.isBlur
            this.isRename = false
            this.isDelete = false
            this.isLeave = false
        },
        getTeacher(){
            api().post('getPerson/'+this.teacherId[0]
            ).then((result) => {
                this.myTeacher = result.data.person
            }).catch((err) => {
                console.log(err)
            })
        },
        renameClass(newName){
            api().put('renameClass/'+this.cId, {
                name: newName
            }).then((result) => {
                if(result.data.success){
                    this.blur()
                    this.$emit('editClass')
                }else{
                    this.errorInput = 'This name is already used'
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        deleteClass(){
            api().delete('deleteClass/'+this.cId).then((result) => {
                if(result.data.success){
                    this.blur()
                    this.$emit('editClass')
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        leaveClass(){
            api().put('leaveClass/'+this.cId,{
                sId: this.$store.getters.user.id
            }).then((result) => {
                if(result.data.success){
                    this.blur()
                    this.$emit('editClass')
                }
            }).catch((err) => {
                console.log(err)
            })
        }, 
        isTeacher(){
            var teacher = false
            for(var i in this.teacherId){
                if(this.teacherId[i] == this.$store.getters.user.id){
                    teacher = true
                    break
                }
            }
            return teacher
        },
        toAnnounce(){
            this.$cookies.set('userState', this.teacher, 60 * 60 * 4)
            this.$cookies.set('class', {
                cId: this.cId,
                name: this.className,
                code: this.cCode,
                tName: this.myTeacher.username,
                tProfile: this.myTeacher.profile}, 60 * 60 * 4)
            this.$router.push({name: 'announcement'})
        }
    },
    computed: {
        teacher () {            
            return this.isTeacher()
        }
    },
    created() {
        this.getTeacher()
    },
}
</script>

<style scoped>
.multi{
    box-shadow: 0px 0px 4px 0px #707070;
    border-radius: 10px;
    padding: 12px;
    background-color: white;
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 1;
    width: 120px;
    text-align: left;
}
button{
    border: none;
    background-color: white;
    color: #707070;
    font-weight: bold;
    margin: 2px 0px;
    font-size: 14px;
}

.aClass{
    border: 1px solid #707070;
    width: 20%;
    min-width: 350px;
    color: #707070;
    border-radius: 20px;
    height: 120px;
    min-height: 100px;
    margin: 10px;
    position: relative;
}



.aClass .theme{
    width: 100%;
    background-color: #1177BE;
    color: #fff;
    position: relative;
    border: 1px solid #707070;
    border-radius: 19px;
    height: 70%;
}


.aClass .theme .teacher{
    position: absolute;
    right: 20px;
    bottom: -25px;
    color: #1177BE;
    font-weight: bold;
}

.aClass .theme .cName{
    position: absolute;
    left: 20px;
    bottom: 10px;
    font-weight: bold;
    font-size: 20px;
}
.moreIcon{
    color: #707070;
    position: absolute;
    left: 30px;
    bottom: 5px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    text-align: center;
}
.moreIcon:hover{
    background-color: #70707070;
    color: white;
}
@media(max-width: 1250px) {
    .aClass{
        width: 40%;
        min-width: 350px;
    }
}

@media(max-width: 900px) {
    .aClass{
        width: 70%;
        min-width: 400px;
        margin: auto;
        margin-bottom: 20px;
    }
}
</style>