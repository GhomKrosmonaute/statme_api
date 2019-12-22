
const mysql         = require('mysql2')
const database      = require('./database.json')
const docs          = require('./docs').types

const db = mysql.createConnection(database)

db.connect()

module.exports = {
    fetchLast:      ( req, res ) => resolve(res, 'SELECT * FROM message ORDER BY created_timestamp DESC LIMIT 1'),
    fetchFirst:     ( req, res ) => resolve(res, 'SELECT * FROM message ORDER BY created_timestamp ASC LIMIT 1'),
    fetchAll:       ( req, res ) => resolve(res, 'SELECT * FROM message'),
    countAll:       ( req, res ) => resolve(res, 'SELECT COUNT(id) as `countAll` FROM message'),
    fetchMessage:   ( req, res ) => _fetch( req, res, 'message_id', 'id' ),
    fetchUser:      ( req, res ) => _fetch( req, res, 'user_id', 'user_id')
}

function resolve( res, query ){
    db.query( query,( err, results, fields ) => {
        if(err) res.status(500).json({ error: 'request error' })
        else res.status(200).json(results)
        console.log( query, results )
    })
}

function _fetch( req, res, param, col ){

    const id = docs.SnowFlake.validation(req.params[param])
    let cols = docs.Columns.validation(req.params.props)

    if (!id) return res.status(403).json({error: 'incorrect id'})
    if (!cols) cols = '*'

    resolve(res, 'SELECT ' + cols + ' FROM message WHERE ' + col + ' = ' + id)

}