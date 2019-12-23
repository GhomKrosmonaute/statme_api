
const express       = require('express')
const controller    = require('./controller')
const routes        = require('./routes')

const routers = {}
for(const version in routes){
    routers[version] = (()=>{
        const router = express.Router()
        routes[version].forEach( route => {
            route.aliases.forEach( path => {
                router.route(path).get(( req, res ) => {
                    return controller[version].fetch( req, res, route.conditions )
                })
                console.log('Route loaded:', path)
                route.actions.forEach( action => {
                    const actionPath = path + action + '/'
                    router.route(actionPath).get(( req, res ) => {
                        return controller[version][action]( req, res, route.conditions )
                    })
                    console.log('Route loaded:', actionPath)
                })
            })
        })
        console.log('Router ready:', router.stack.length, 'routes')
        return router
    })()
}

module.exports = routers