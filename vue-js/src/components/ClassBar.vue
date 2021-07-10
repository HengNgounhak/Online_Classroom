<template>
    <div v-if="myClass" class="aClass">
        <div class="theme">
            <span  class="cName">{{ myClass.name }} <br> <span id="code">Code: {{myClass.code}}</span></span>
            <div class="teacher">
                <span>{{myClass.tName}}</span>
                <span><profile color="black" size="42px" :path="myClass.tProfile"/></span>
            </div>
        </div>
        <div class="menu">
            <ul>
                <li class="nav-item">
                    <router-link to="/announcement">Annoncement</router-link>
                </li>
                <li>
                    <router-link to="/assignment" class="title">Assignment</router-link>
                </li>
                <li>
                    <router-link to="/file" class="title">File</router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/people">People</router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    computed:{
        myClass(){
            return this.$cookies.get('class')
        }
    }
}
</script>

<style scoped>
.aClass{
    border: 1px solid #707070;
    width: 80%;
    color: #707070;
    border-radius: 20px;
    height: 140px;
    min-height: 120px;
    margin: auto;
    margin-top: 10px;
    position: relative;
}

.aClass .theme{
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
    font-size: 24px;
    line-height: 20px;
}

.aClass .theme .cName #code{
    font-weight: bold;
    font-size: 12px;
}

.aClass .menu{
    text-align: center;
    margin-top: 10px;
}

.aClass .menu ul{
    padding: 0px;
    list-style-type: none;
}

.aClass .menu ul li{
    display: inline;
    min-width: 90px;
    text-align: center;
    font-weight: bold;
    color: #707070;
    margin: 0 5px;
    padding: 0 5px;
    position: relative;
}

.aClass .menu ul li a{
    color: #707070;
    text-decoration: none;
}

.aClass .menu ul li a.router-link-exact-active, .aClass .menu ul li a:hover{
    color: #1177BE;
}

.aClass .menu ul li:hover::after, .aClass .menu ul li a.router-link-exact-active::after{
    content: "";
    position: absolute;
    left: 0;
    bottom: -10px;
    background-color: #1177BE;
    width: 100%;
    height: 5px;
    border-radius: 5px 5px 0 0;
}

@media(max-width: 1100px) {
    .aClass{
        width: 85%;
    }
}

@media(max-width: 1000px) {
    .aClass{
        width: 90%;
    }
}

@media(max-width: 900px) {
    .aClass{
        width: 95%;
    }
}

@media(max-width: 700px) {
    .aClass .menu{
        text-align: start;
        margin-left: 20px;
    }
}
</style>