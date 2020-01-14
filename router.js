
const express       = require('express')
const controller    = require('./controller')
const routes        = require('./routes.json')

module.exports = (()=>{
    const router = express.Router()
    for(const name1 in routes){
        for(const action1 in routes[name1]){

            let palier = routes[name1][action1]
            addRoute( router, name1, action1 )

            if(palier){
                for(const name2 in palier){
                    for(const action2 in palier[name2]){

                        palier = routes[name1][action1][name2][action2]
                        addRoute( router, name1, action1, name2, action2 )

                        if(palier){
                            for(const name3 in palier){
                                for(const action3 in palier[name3]){

                                    addRoute( router, name1, action1, name2, action2, name3, action3 )

                                }
                            }
                        }
                    }
                }
            }
        }
    }
    console.log('Router ready:', router.stack.length, 'routes')
    return router
})()

function setHeaders( res ){
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Header", "Content-Type")
}

function addRoute( router, ...parts ){
    const resolved = []
    parts.forEach(( part, index ) => {
        resolved.push(part)
        if(part === 'id'){
            resolved.push(`:${parts[index-1]}ID`)
        }
    })
    const path = `/${resolved.join('/')}/`
    router.route().get(( req, res ) => { setHeaders(res)
        return controller.fetch( req, res, resolved )
    }); console.log('Route loaded:', path)
}