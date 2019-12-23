
const docs = require('./docs')

const routes = {
    v1: {
        api: {
            fetchLast: ['/message/last'],
            fetchFirst: ['/message/first'],
            fetchAll: [
                '/message/',
                '/message/all/'
            ],
            countAll: [
                '/message/count/',
                '/message/all/count/'
            ],
            fetchMessage: [
                '/message/:message_id/',
                '/message/id/:message_id/',
            ],
            fetchUser: [
                '/message/user/:user_id/',
                '/message/author/:user_id/',
            ],
            countUser: [
                '/message/user/:user_id/count/',
                '/message/author/:user_id/count/',
                '/message/member/:user_id/count/'
            ],
            fetchGuild: [
                '/message/guild/:guild_id/',
                '/message/server/:guild_id/'
            ],
            countGuild: [
                '/message/guild/:guild_id/count',
                '/message/server/:guild_id/count'
            ],
            fetchMember: [ '/message/member/:guild_id/:user_id/' ],
            countMember: [ '/message/member/:guild_id/:user_id/count' ],
            fetchWords: [
                '/message/words/:word_count/',
                '/message/words/max/:word_count/',
                '/message/words/min/:word_count/',
                '/message/words/max/',
                '/message/words/min/'
            ],
            countWords: [
                '/message/words/:word_count/count/',
                '/message/words/max/:word_count/count/',
                '/message/words/min/:word_count/count/'
            ],
            fetchLength: [
                '/message/length/:length/',
                '/message/length/max/:length/',
                '/message/length/min/:length/',
                '/message/length/max/',
                '/message/length/min/',
            ],
            countLength: [
                '/message/length/:length/count/',
                '/message/length/max/:length/count/',
                '/message/length/min/:length/count/',
            ],
            fetchEveryone: [
                '/message/everyone/'
            ],
            countEveryone: [
                '/message/everyone/count'
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
}

for(const version in routes){
    const versionRoutes = routes[version].api
    const doc = docs[version].props
    routes[version].html.push({
        path: [`/statme/api/${version}/`],
        title: `Statme Discord bot API <span class=" font-weight-bold"> ${version} </span>`,
        content: `
            <h2> Routes </h2>
            <table class="table rounded">
                <thead>
                    <tr>
                        <th class="px-2"> Methods </th>
                        <th class="px-2"> Routes </th>
                        <th class="px-2"> </th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(versionRoutes).map( entry => {
                        const [ method, paths ] = entry
                        return `
                            <tr>
                                <td class="px-2"><code> ${method}(); </code></td>
                                <td class="px-2">
                                    ${paths.map( path => {
                                        let example = path.slice(0) 
                                        doc.forEach( item => {
                                            example = example.replace( new RegExp( ':' + item.name, 'gi' ), item.default )
                                        })
                                        return `<a href="http://163.172.176.138:2834/statme/api/v1${example}"> ${path} </a>`
                                    }).join('<br>')}
                                </td>
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



