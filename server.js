
const fs = require('fs')
const server = require('express')()
const routes = require('./routes').v1.html
const routers = require('./router')

const port = 2834
const template = fs.readFileSync( './template.html', { encoding: 'utf8' } )

routes.forEach( route => {
    route.path.forEach( path => {
        server.get( path, ( req, res ) => {
            res.setHeader('Content-Type','text/html')
            let html = template.slice(0)
            for(let prop in route){
                if(prop === 'path') continue
                html = html.replace( new RegExp( `{{${ prop }}}`, 'g' ), route[prop] )
            }
            res.status(200).send(html)
        })
    })
})

for(const version in routers){
    server.use( `/statme/api/${version}/`, routers[version] );
}

server.listen( port, () => {
    console.log('Connected to 163.172.176.138:' + port)
})

