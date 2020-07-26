
const { DNS } = require('./config')
const docs = require('./docs')
const routes = require('./routes')

const views = {
    v1: [
        {
            path: ['/','/statme/'],
            title: 'Statme Discord bot API',
            content: `
                <h2> Versions </h2>
                <ul>
                    <li><a href="${DNS}/v1/"> v1 </a></li>
                </ul>
            `
        }
    ]
}

for(const version in routes){
    const doc = docs[version].props
    views[version].push({
        path: [`/${version}/`],
        title: `Statme Discord bot API <span class="font-weight-bold"> ${version} </span>`,
        content: `
            <h2> Sommaire </h2>
            <ol>
                <li><a href="#routes"> Routes </a></li>
                <li><a href="#arguments"> Arguments </a></li>
            </ol>
            <h2 id="routes"> Routes </h2>
            <table class="table rounded">
                <tbody>
                    ${routes[version].map( route => {
                        const { result, actions, aliases } = route
                        return aliases.map( path => {
                            return [ false, ...actions ].map( action => {
                                const PATH = action ? path + action + '/' : path
                                let example = PATH.slice(0)
                                doc.forEach( d => example = example.replace( new RegExp(`:${d.name}`, 'ig'), d.default ) )
                                return `
                                    <tr>
                                        <td><a href="${DNS}/v1${ example }"> ${ PATH } </a></td>
                                        <td><small> ${ action ? '<code>' + action + '();</code><span class="text-muted"> method on </span>' : '' }${ result } </small></td>
                                    </tr>
                                `
                            }).join('')
                        }).join('')
                    }).join('')}
                </tbody>
            </table>
            <h2 id="arguments"> Arguments </h2>
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

module.exports = views