
const express       = require('express')
const controller    = require('./controller')
const routes        = require('./routes').api

module.exports.v1 = (()=>{
    const router = express.Router()
    routes.v1.forEach( route => {
        console.log('Route loaded:', route.path)
        router.route(route.path).get(controller[route.method])
    })
    console.log('Router ready:', routes.v1.length, 'routes')
    return router
})()