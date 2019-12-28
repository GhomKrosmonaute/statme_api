
const express       = require('express')
const controller    = require('./controller')
const routes        = require('./routes')

const routers = {}
for(const version in routes){
    routers[version] = (()=>{
        const router = express.Router()
        routes[version].forEach( route => {
            route.aliases.forEach( path => {
                router.route(path).get(( req, res ) => { setHeaders(res)
                    return controller[version].fetch( req, res, route.conditions )
                })
                console.log('Route loaded:', path)
                route.actions.forEach( action => {
                    if(!/min|max/.test(action)){
                        const actionPath = path + action + '/'
                        router.route(actionPath).get(( req, res ) => { setHeaders(res)
                            return controller[version][action]( req, res, route.conditions )
                        })
                        console.log('Route loaded:', actionPath)
                    }else{
                        ['first','last','low','high','count'].forEach( subAction => {
                            const actionPath = path + action + '/' + subAction + '/'
                            router.route(actionPath).get(( req, res ) => { setHeaders(res)
                                return controller[version][subAction + action[0].toUpperCase() + action.slice(1)]( req, res, route.conditions )
                            })
                            console.log('Route loaded:', actionPath)
                        })
                    }
                })
            })
        })
        console.log('Router ready:', router.stack.length, 'routes')
        return router
    })()
}

module.exports = routers

function setHeaders(res){
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Header", "Content-Type")
}