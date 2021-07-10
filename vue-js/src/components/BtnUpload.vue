<template>
    <div>
        <input ref="files" v-if="idfile != null" @change="onFileChange" type="file" :name="idfile" :id="idfile" style="display:none;" multiple>
        <button type="button" @click="thisFileUpload" :style="{ color: color, 'font-size': size, padding: padding, border: border }" :disabled="disabled"><fa v-if="border != 'none'" class="icon" icon="paperclip"/> {{text}}</button> 
    </div>
</template>

<script>
export default {
    props:["idfile", "text", "color", "size", "padding", "border", "disabled"],
    data() {
        return {
            file: ''
        }
    },
    methods:{
        thisFileUpload(){
            document.getElementById(this.idfile).click()
        },
        onFileChange(){
            this.$emit('getFile', this.$refs.files.files)
        }
    }
}
</script>

<style scoped>
.icon{
    transform: rotate(-45deg)
}

button{
  border: 1px solid #707070;
  border-radius: 25px;
  background-color: white;
  padding: 10px 20px;
  font-weight: bold;
  color: #1177BE;
}
</style>