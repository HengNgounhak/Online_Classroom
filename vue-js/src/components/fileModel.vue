<template>
    <div>
        <div class="main">
            <fa class="exit" icon="times" @click="$emit('closeUpload')"/>
            <h5 class="mb-3">Upload Files</h5>
            <file-upload @removeFile="removeFile" v-for="(f, index) in fName" :key="index" :fileName="f" :haveRemove="true" style="width: 100%"/>
            <div class="btn">
                <btn @click="$emit('closeUpload')" text="Cancel" size="14px" padding="5px 15px"/>
                <div class="right">
                    <btn @click="$emit('upload')" text="Upload" size="14px" padding="5px 15px"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FileUpload from './fileUpload.vue'
// import api from '../services/api'
export default {
    components: { FileUpload },
    props: ["fName"],
    methods: {
        removeFile(fName){
            this.$emit('removeFile', fName)
        }
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

.main .btn{
    display: flex;
    justify-content: space-between;
    padding: 0px;
    margin-top: 20px;
}

</style>