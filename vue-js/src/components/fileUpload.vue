<template>
    <div class="file">
        <a class="text-decoration-none" :href="'http://localhost:4000/'+fileName">
            <fa class="pic" icon="file-alt"/>
            <span class="ml-3 mr-5">{{ fileName }}</span>
        </a>
        <fa v-if="haveRemove" name="remove" class="download border-0" icon="times" @click="remove" />  
        <fa v-else @click="$emit('donwload', fileName)" class="download" icon="arrow-down"/>          
    </div>
</template>

<script>
export default {
    props: ['fileName', 'haveRemove', 'disabled'],
    methods: {
        remove(){
            if(!this.disabled){
                this.$emit('removeFile', this.fileName)
            }
        }
    },
}
</script>

<style scoped>
.file{
    border: 1px solid #707070;
    border-radius: 5px;
    height: 50px;
    width: 400px;
    display: flex;
    align-items: center;
    padding: 10px;
    margin-top: 10px;
    color: #707070;
    position: relative;
    font-size: 14px;
}
a{
    color: #707070;
    display: flex;
    align-items: center; 
}
a:hover{
    color: #1177BE;
}
.pic{
    font-size: 36px;
}

.download{
    position: absolute;
    right: 20px;
    top: 15px;
    font-size: 20px;
    padding-bottom: 2px;
    border-bottom: 3px solid #707070;
}
@media(max-width: 750px) {
    .file{
        width: 300px;
    }
}
</style>