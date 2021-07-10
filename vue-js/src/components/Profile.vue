<template>
    <div id="pic" v-if="path" :style="{ 'background-image': 'url(http://localhost:4000/' + path + ')', 'width': size, 'height': size}"></div>
    <fa v-else id="profile" icon="user-circle" :style="{ 'font-size': size, 'color': color }"/>
    <!-- <img id="pic"> -->
</template>

<script>
export default {
    props: ["color", "size", "path"]
}
</script>

<style>
#profile{
    background-color: white;
    border-radius: 50%;
    color: #1177BE;
    font-size: 36px;
}
#pic{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1.8px solid black;
    display: inline-block;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 50%;
}
</style>