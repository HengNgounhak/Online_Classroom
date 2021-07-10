<template>
    <div class="view">
        <div>
            <button @click="$emit('isBack')"><fa icon="angle-left"/> Back</button>
        </div>
        <table width="100%" class="mt-4">
            <tr id="th">
                <td width="35%" class="pb-2">Assignment</td>
                <td width="30%" class="text-center pb-2">Status</td>
                <td width="20%" class="text-center pb-2">Due to</td>
                <td width="15%" class="text-right pb-2">Score</td>
            </tr>
            <tr-view-grade v-for="(a, i) in assignment" :key="i" :assignment="a"/>
        </table>    
    </div>
</template>

<script>
import trViewGrade from './trViewGrade.vue'
export default {
    components: { trViewGrade },
    props: ['assignment']
}
</script>

<style scoped>
.view{
    width: 60%;
    margin: auto;
    margin-top: 20px;
}

button{
    font-weight: bold;
    background-color: white;
    border: none;
    color: #1177BE;
    font-size: 18px;
}

#th{
    width: 100%;
    font-weight: bold;
    border-bottom: 2px solid #707070;
    color: #707070;
}
</style>