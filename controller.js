
const mysql         = require('mysql2')
const database      = require('./database.json')
const docs          = require('./docs').v1

const db = mysql.createConnection(database)

db.connect()

module.exports.v1 = {
    fetch: fetch,
    last: last,
    first: first,
    count: count,
    min: min,
    max: max
}

function resolve( res, query ){
    db.query( query,( err, results, fields ) => {
        if(err){ console.error(err.message)
            res.status(500).json({ error: 'request error' })
        } else res.status(200).json(results)
        console.log( query, '\n', results )
    })
}

function fetch( req, res, conditions, keywords ){

    if(!Array.isArray(conditions)) conditions = []
    if(!Array.isArray(keywords)) keywords = []

    const where = conditions.slice(0)
    console.log(req.params)
    for(const param in req.params){
        const doc = docs.props.find( d => d.name === param )
        const value = docs.types[doc.type].validation(req.params[param])
        if(value === false) return res.status(403).json({ error: `incorrect ${param} (${doc.type})` })
        let sign = '=';
        if(keywords.includes('min')) sign = '>='
        if(keywords.includes('max')) sign = '<='
        where.push(`\`${doc.corresponding}\` ${sign} ${value}`)
    }
    if(where.length > 0) where[0] = 'WHERE ' + where[0]

    let select = keywords.includes('count') ? 'COUNT(`index`) AS `count`' : '*'
    let order = ''
    if(keywords.includes('first')) order = 'ORDER BY `created_timestamp` ASC LIMIT 1'
    if(keywords.includes('last'))  order = 'ORDER BY `created_timestamp` DESC LIMIT 1'
    if(keywords.includes('min')){
        // TODO: give message with min value
    }
    if(keywords.includes('max')){
        // TODO: give message with max value
    }

    resolve( res, `SELECT ${select} FROM \`message\` ${where.join(' AND ')} ${order}`)
}

function count( req, res, cond ){ fetch( req, res, cond, ['count'] ) }
function first( req, res, cond ){ fetch( req, res, cond, ['first'] ) }
function last( req, res, cond ){ fetch( req, res, cond, ['last'] ) }
function min( req, res, cond ){ fetch( req, res, cond, ['min'] ) }
function max( req, res, cond ){ fetch( req, res, cond, ['max'] ) }

function temp( req, res ){ res.status(500).json({ error: 'this route is temporarily disabled' }) }