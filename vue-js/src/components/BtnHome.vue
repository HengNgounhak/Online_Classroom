<template>
  <router-link to="/"><fa class="icon" icon="home"/></router-link>
</template>

<script>
export default {

}
</script>

<style scoped>
.icon{
    font-size: 52px;
    padding: 8px;
    color: #707070a1;
    border: 2px solid #707070a1;
    border-radius: 50%;
    position: fixed;
    left: 10%;
    top: 85%;
    z-index: 1;
}

.icon:hover{
    color: #707070;
    border: 2px solid #707070;
}

@media(max-width: 900px) {
    .icon{
        font-size: 42px;
        padding: 5px;
    }
} 
</style>