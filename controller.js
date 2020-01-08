
const Discord       = require('discord.js')
const mysql         = require('mysql2')
const log           = require('log-to-file')
const docs          = require('./docs').v1
const config        = require('./config.json')

const client = new Discord.Client(); client.login(config.token)
const db = mysql.createConnection(config.database); db.connect()

module.exports.v1 = {
    fetch: fetch,
    last: last,
    first: first,
    count: count,
    min: min,
    max: max,
    low: low,
    high: high,
}

function resolve( res, query ){
    log(query); db.query( query,( err, results, fields ) => {
        if(err){ console.error(err.message)
            res.status(500).json({ error: 'request error' })
        } else res.status(200).json( prepare(results) )
        console.log( err ? 'Error:' : 'Valid:', query )
    })
}

function fetch( req, res, conditions, keywords ){

    if(!Array.isArray(conditions)) conditions = []
    if(!Array.isArray(keywords)) keywords = []

    let select = keywords.includes('count') ? 'COUNT(`index`) AS `count`' : '*'

    let order = ''
    if(keywords.includes('first')) order = 'ORDER BY `created_timestamp` ASC LIMIT 1'
    if(keywords.includes('last'))  order = 'ORDER BY `created_timestamp` DESC LIMIT 1'

    const where = conditions.slice(0)
    console.log(req.params)
    for(const param in req.params){
        const doc = docs.props.find( d => d.name === param )
        const value = docs.types[doc.type].validation(req.params[param])
        if(value === false) return res.status(403).json({ error: `incorrect ${param} (${doc.type})` })
        let sign = '=';
        if(keywords.includes('min')) sign = '>='
        if(keywords.includes('max')) sign = '<='
        if(keywords.includes('low')) order = 'ORDER BY `' + doc.corresponding + '` ASC LIMIT 1'
        if(keywords.includes('high')) order = 'ORDER BY `' + doc.corresponding + '` DESC LIMIT 1'
        where.push(`\`${doc.corresponding}\` ${sign} ${value}`)
    } if(where.length > 0) where[0] = 'WHERE ' + where[0]

    resolve( res, `SELECT ${select} FROM \`message\` ${where.join(' AND ')} ${order}`)
}

function count( req, res, cond ){ fetch( req, res, cond, ['count'] ) } // number
function first( req, res, cond ){ fetch( req, res, cond, ['first'] ) } // element
function last( req, res, cond ){ fetch( req, res, cond, ['last'] ) } // element
function min( req, res, cond ){ fetch( req, res, cond, ['min'] ) } // list
function max( req, res, cond ){ fetch( req, res, cond, ['max'] ) } // list
function low( req, res, cond ){ fetch( req, res, cond, ['low'] ) } // element
function high( req, res, cond ){ fetch( req, res, cond, ['high'] ) } // element

function temp( req, res ){ res.status(500).json({ error: 'this route is temporarily disabled' }) }

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