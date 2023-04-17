import Vue from 'vue'
import VueRouter from 'vue'

Vue.use(VueRouter)

const routes = [{
    path: '/login',
    name: 'login'
}]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach(async(to, from, next) => {
    const requiredAuth = to.matched.some(x => x.meta.requiredAuth)
    const isAuthenticated = localStorage.getItem('accessToken')
    if (requiredAuth && !isAuthenticated) {
        next('login')
    } else if (to.path = '/login' && isAuthenticated) {
        next('dashboard')
    } else if (to.meta.requiredRoles) {
        const userRole = JSON.parse(localStorage.getItem('userInfo')?.role_id)
        if (!to.meta.requiredRoles.includes(userRole)) {
            next('404')
        }
    }
})