import { createWebHistory, createRouter } from "vue-router";
import SignIn from '../views/SignIn.vue'
import SignUp from '../views/SignUp.vue'
import Home from '../views/Home.vue'
import Account from '../views/Account.vue'
import Announcement from '../views/Announcement.vue'
import People from '../views/People.vue'
import File from '../views/File.vue'
import Assignment from '../views/Assignment.vue'
import ViewAssignment from '../views/ViewAssignment.vue'


const routes = [{
        path: "/signin",
        name: "signin",
        component: SignIn
    },
    {
        path: "/signup",
        name: "signup",
        component: SignUp
    },
    {
        path: "/",
        name: "home",
        component: Home
    },
    {
        path: "/account",
        name: "account",
        component: Account
    },
    {
        path: "/announcement",
        name: "announcement",
        component: Announcement
    },
    {
        path: "/people",
        name: "people",
        component: People
    },
    {
        path: "/file",
        name: "file",
        component: File
    },
    {
        path: "/assignment",
        name: "assignment",
        component: Assignment
    },
    {
        path: "/view-assignment/:assignmentId",
        name: "view-assignment",
        component: ViewAssignment,
    }
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router