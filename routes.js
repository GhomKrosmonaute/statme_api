
const docs = require('./docs').props

const routes = {
    api: {
        v1: [
            {path: '/message/last', method: 'fetchLast'},
            {path: '/message/first', method: 'fetchFirst'},

            {path: '/message/', method: 'fetchAll'},
            {path: '/message/all/', method: 'fetchAll'},

            {path: '/message/count/', method: 'countAll'},
            {path: '/message/all/count/', method: 'countAll'},

            {path: '/message/id/:message_id/', method: 'fetchMessage'},
            {path: '/message/id/:message_id/:props', method: 'fetchMessage'},

            {path: '/message/user/:user_id/', method: 'fetchUser'},
            {path: '/message/author/:user_id/', method: 'fetchUser'},
        ]
    },
    html: [
        {
            path: ['/','/statme/','/statme/api/'],
            title: 'Statme Discord bot API',
            content: `
<h2> Versions </h2>
<ul>
    <li><a href="http://163.172.176.138:2834/statme/api/v1/"> v1 </a></li>
</ul>
            `
        }
    ]
}

for(const version in routes.api){
    const versionRoutes = routes.api[version]
    const doc = docs[version]
    routes.html.push({
        path: [`/statme/api/${version}/`],
        title: `Statme Discord bot API <span class=" font-weight-bold"> ${version} </span>`,
        content: `
<h2> Routes </h2>
<table class="table rounded">
    <tbody>
        ${versionRoutes.map(route => {
            let examplePath = route.path
            doc.forEach( item => {
                examplePath = examplePath.replace( new RegExp( ':' + item.name, 'gi' ), item.default )
            })
            return `
                <tr>
                    <td class="px-2"><a href="http://163.172.176.138:2834/statme/api/v1${examplePath}"> ${route.path} </a></td>
                    <td class="px-2"><code> ${route.method}(); </code></td>
                </tr>
            `
        }).join('\n')}
    </tbody>
</table>
<h2> Arguments </h2>
<table class="table rounded">
    <thead>
        <tr>
            <th class="px-2"> Argument </th>
            <th class="px-2"> Type </th>
            <th class="px-2"> Description </th>
            <th class="px-2"> Example </th>
        </tr>
    </thead>
    <tbody>
        ${doc.map( item => {
            return `
                <tr>
                    <td class="px-2"> <span class="text-muted">:</span>${item.name} </td>
                    <td class="px-2"> ${item.type} </td>
                    <td class="px-2"> ${item.comment} </td>
                    <td class="px-2"> ${item.example} </td>
                </tr>
            `
        }).join('\n')}
    </tbody>
</table>
        `
    })
}

module.exports = routes



