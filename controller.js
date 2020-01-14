
const Discord       = require('discord.js')
const mysql         = require('mysql2')
const config        = require('./config.json')

const client = new Discord.Client(); client.login(config.token)
const db = mysql.createConnection(config.database); db.connect()

module.exports = {

    fetchAll: async (req,res) => {
        
        const messages = await query(`
            SELECT * FROM message
        `)

        sendJSON(stats(messages))

    },

    fetchUser: async (req,res) => {

        const params = validParams(req)
        if(!params) return

        const { userID } = params

        const messages = await query(`
            SELECT * FROM message 
            WHERE author_id = ${userID}
        `)

        if(client.ready){
            const user = client.users.get(userID)
            sendJSON(fusion(filterProperties(user),stats(messages)))
        }else{
            sendJSON(stats(messages))
        }

    },

    fetchGuild: async (req,res) => {

        const params = validParams(req)
        if(!params) return

        const { guildID } = params

        const messages = await query(`
            SELECT * FROM message 
            WHERE guild_id = ${guildID}
        `)

        if(client.ready){
            const guild = client.guilds.get(guildID)
            sendJSON(fusion(filterProperties(guild),stats(messages)))
        }else{
            sendJSON(stats(messages))
        }
    },

    fetchChannel: async (req,res) => {

        const params = validParams(req)
        if(!params) return

        const { channelID } = params

        const messages = query(`
            SELECT * FROM message
            WHERE channel_id = ${channelID}
        `)

        if(client.ready){
            const channel = client.channels.get(channelID)
            sendJSON(fusion(filterProperties(channel),stats(messages)))
        }else{
            sendJSON(stats(messages))
        }

    },

    fetchMember: async (req,res) => {

        const params = validParams(req)
        if(!params) return

        const { userID, guildID } = params

        const messages = await query(`
            SELECT * FROM message 
            WHERE author_id = ${userID}
            AND guild_id = ${guildID}
        `)

        if(client.ready){
            const user = client.users.get(userID)
            const member = client.guilds.get(guildID).members.get(userID)
            sendJSON(fusion(
                filterProperties(member),
                filterProperties(user),
                stats(messages)
            ))
        }else{
            sendJSON(stats(messages))
        }

        sendJSON(fusion(filterProperties(user),stats(messages)))
    },
}

client.on('error', console.error )
client.once('ready', done => {
    client.ready = true
    console.log('Connected to Statme Discord bot')
})

function query( query ){
    return new Promise((resolve,reject)=>{
        db.query( query, ( err, results, fields ) => {
            if(err) reject(err)
            resolve(results)
        })
    })
}

function sendJSON( json ){
    res.status(200).json( json )
    return true
}

function sendError( code, message="unknow error" ){
    res.status(code).json({ error: message })
    return false
}

function getParam( value ){
    return value ? /^\d{18,}$/.test(param) ? `'${value}'` : false : false
}

function fusion( ...objects ){
    return Object.assign( {}, ...objects )
}

function filterProperties( object ){
    const filtered = {
        id: object.id
    }
    for(const prop in object){
        switch(prop){
            case 'avatarURL':
            case 'bot':
            case 'createdTimestamp':
            case 'displayName':
            case 'username':
            case 'name':
            case 'tag':
            case 'iconURL':
            case 'memberCount':
                filtered[prop] = object[prop]
                break
        }
    }
    return filtered
}

function validParams(req){

    const params = {}

    for(const name in req.params){
        params[name] = getParam(req.params[name])
        if(!params[name]){
            return sendError(422,`invalid ${name} format`)
        }
    }

    return params

}