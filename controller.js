
const mysql         = require('mysql2')
const database      = require('./database.json')
const docs          = require('./docs').v1

const db = mysql.createConnection(database)

db.connect()

module.exports = {
    fetchLast:      ( req, res ) => resolve( res, 'SELECT * FROM `message` ORDER BY `created_timestamp` DESC LIMIT 1' ),
    fetchFirst:     ( req, res ) => resolve( res, 'SELECT * FROM `message` ORDER BY `created_timestamp` ASC LIMIT 1' ),
    fetchAll:       _fetch,
    countAll:       _count,
    fetchMessage:   _fetch,
    fetchUser:      _fetch,
    countUser:      _count,
    fetchGuild:     _fetch,
    countGuild:     _count,
    fetchMember:    _fetch,
    countMember:    _count,
    fetchWords:     _temp,
    countWords:     _temp,
    fetchLength:    _temp,
    countLength:    _temp,
    fetchEveryone:  ( req, res ) => resolve( res, 'SELECT * FROM `message` WHERE `has_everyone` = 1' ),
    countEveryone:  ( req, res ) => resolve( res, 'SELECT COUNT(`index`) AS `count` FROM `message` WHERE `has_everyone` = 1' ),
}

function resolve( res, query ){
    db.query( query,( err, results, fields ) => {
        if(err){ console.error(err.message)
            res.status(500).json({ error: 'request error' })
        } else res.status(200).json(results)
        console.log( query, '\n', results )
    })
}

function _fetch( req, res, keywords ){

    if(!Array.isArray(keywords)) keywords = []

    const where = []
    for(const param in req.params){
        const doc = docs.props.find( d => d.name === param )
        const value = docs.types[doc.type].validation(req.params[param])
        if(value === false) return res.status(403).json({ error: `incorrect ${param} (${doc.type})` })
        where.push(`\`${doc.corresponding}\` = ${value}`)
    } if(where.length > 0) where[0] = 'WHERE ' + where[0]

    let select = keywords.includes('count') ? 'COUNT(`index`) AS `count`' : '*'
    resolve( res, `SELECT ${select} FROM \`message\` ${where.join(' AND ')}`)
}

function _count( req, res ){
    _fetch( req, res, ['count'] )
}

function _temp( req, res ){
    res.status(500).json({ error: 'this route is temporarily disabled' })
}