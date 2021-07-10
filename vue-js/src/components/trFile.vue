<template>
    <div>
        <blur v-show="isMore" @click="more"/>
        <tr>
            <td><a :href="'http://localhost:4000/'+file.name"><fa class="icon" icon="file"/><span class="d-inline-block text-truncate" style="max-width: 80%;"> {{file.name}}</span></a></td>
            <td>{{file.dateAdd}}</td>
            <fa v-if="isTeacher" @click="more" class="moreBtn" icon="ellipsis-h"/>
            <fa v-else @click="donwload" class="download" icon="arrow-down"/>
            <div v-show="isMore" class="more">
                <button @click="deleteFile">Delete</button>
            </div>
        </tr> 
    </div>
    
</template>

<script>
import api from '../services/api'
import axios from 'axios'
export default {
    props: ['file'],
    data(){
        return{
            isMore: false
        }
    },
    methods:{
        more(){
            this.isMore = !this.isMore
        },
        deleteFile(){
            api().delete('deleteFile/'+this.file._id).then((result) => {
                if(result.data.success){
                    this.$router.go()
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        donwload(){
            axios({
                url: 'http://localhost:4000/' + this.file.name,
                method: 'GET',
                responseType: 'blob',
            }).then((response) => {
                var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                var fileLink = document.createElement('a');

                fileLink.href = fileURL;
                fileLink.setAttribute('download', this.file.name);
                document.body.appendChild(fileLink);

                fileLink.click();
            });
        }
    },
    computed: {
        isTeacher(){
            if(this.$cookies.get('userState') == 'true'){
                return true
            }
            return false
        }    
    }
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
    font-size: 15px;
}

tr:hover{
    background-color: #70707020;
}

td{
    width: 50%;
}

.icon{
    font-size: 24px;
    margin-right: 10px;
}
.moreBtn{
    font-size: 16px;
    position: absolute;
    top: 40%;
    right: 0px;
}

.more{
    position: absolute;
    top: 35px;
    right: -80px;
    z-index: 1;
    box-shadow: 0px 0px 4px 0px #707070;
    border-radius: 10px;
    padding: 5px 10px;
    background-color: white;
}
button{
    border: none;
    background-color: white;
    color: #707070;
    font-weight: bold;
    margin: 2px 0px;
}
.download{
    position: absolute;
    right: 20px;
    top: 15px;
    font-size: 20px;
    padding-bottom: 2px;
    border-bottom: 3px solid #707070;
}

a{
    text-decoration: none;
    color: #707070;
}
a:hover{
    color: #1177BE;
}

</style>