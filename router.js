
const express       = require('express')
const controller    = require('./controller')
const routes        = require('./routes').v1.api

module.exports.v1 = (()=>{
    const router = express.Router()
    for(const method in routes){
        routes[method].forEach( path => {
            console.log('Route loaded:', path)
            router.route(path).get(controller[method])
        })
    }
    console.log('Router ready:', router.stack.length, 'routes')
    return router
})()