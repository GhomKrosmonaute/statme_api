
const DNS = 'http://127.0.0.1:2834' //'https://statme-api.tk'
const routes = require('./routes')

const views = [
    {
        path: ['/','/doc/'],
        title: 'Statme Discord bot API <span class="font-weight-bold"> v1.0.2 </span>',
        content: (()=>{
            const divides = []
            for(const route in routes){
                divides.push(`
                    <div class="p-4">
                        <h3> ${route} </h3>
                        <p> ${routes[route]} </p>
                    </div>
                `)
            }
            return `
                <div class="d-flex flex-wrap justify-content-left">
                    ${divides.join('')}
                </div>    
            `
        })()
    }
]

module.exports = views