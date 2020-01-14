
const express       = require('express')
const routes        = require('./routes.json')
const controller    = require('./controller')

module.exports = (()=>{
    const router = express.Router()
    for(const route in routes){
        router.route(route).get((req,res) => {
            res.setHeader("Access-Control-Allow-Origin", "*")
            res.setHeader("Access-Control-Allow-Header", "Content-Type")
            return controller[routes[route]](req,res)
        })
        console.log('Route loaded:', route)
    }
    console.log('Router ready:', router.stack.length, 'routes')
    return router
})()