
const Discord       = require('discord.js')
const mysql         = require('mysql2')
const log           = require('log-to-file')
const config        = require('./config.json')

const client = new Discord.Client(); client.login(config.token)
const db = mysql.createConnection(config.database); db.connect()

module.exports = ( req, res, resolvedPath ) => {

    if(!Array.isArray(conditions)) conditions = []

    let select = keyword === 'count' ? 'COUNT(`index`) AS `count`' : '*'

    let order = ''
    if(keyword === 'first') order = 'ORDER BY `created_timestamp` ASC LIMIT 1'
    if(keyword === 'last')  order = 'ORDER BY `created_timestamp` DESC LIMIT 1'

    const where = conditions.slice(0)
    for(const param in req.params){
        if(/^\d{18,}$/.test(req.params[param]))
        const value = `'${req.params[param]}'`
        if(value === false) return res.status(403).json({ error: `incorrect ${param} (${doc.type})` })
        let sign = '=';
        if(keyword === 'min') sign = '>='
        if(keyword === 'max') sign = '<='
        if(keyword === 'low') order = 'ORDER BY `' + doc.corresponding + '` ASC LIMIT 1'
        if(keyword === 'high') order = 'ORDER BY `' + doc.corresponding + '` DESC LIMIT 1'
        where.push(`\`${doc.corresponding}\` ${sign} ${value}`)
    } if(where.length > 0) where[0] = 'WHERE ' + where[0]

    resolve( res, `SELECT ${select} FROM \`message\` ${where.join(' AND ')} ${order}`)

}

function resolve( res, query ){
    log( query, './sql.log' ); db.query( query,( err, results, fields ) => {
        if(err){ console.error(err.message)
            res.status(500).json({ error: 'request error' })
        } else res.status(200).json( prepare(results) )
        console.log( '\t', err ? 'Error:' : 'Valid:', query )
    })
}

client.on('error', console.error )
client.once('ready', done => {
    client.ready = true
    console.log('Connected to Statme Discord bot')
})

function prepare( results ){
    if(!client.ready) return results
    return results.map(result => {
        if(client.users.has(result.user_id)){
            const user = client.users.get(result.user_id)
            result.user_name = user.username
            result.user_image = user.avatarURL
        }
        if(client.guilds.has(result.guild_id)){
            const guild = client.guilds.get(result.guild_id)
            result.guild_name = guild.name
            result.guild_image = guild.iconURL
        }
        if(client.channels.has(result.channel_id)){
            const channel = client.channels.get(result.channel_id)
            result.channel_name = channel.name
        }
        if(result.created_timestamp)
        result.created_timestamp = new Date(result.created_timestamp).getTime()
        return result
    })
}