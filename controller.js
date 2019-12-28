
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
    max: max,
    low: low,
    high: high,
    firstMin: firstMin,
    firstMax: firstMax,
    lastMin: lastMin,
    lastMax: lastMax,
    countMin: countMin,
    countMax: countMax,
    lowMin: lowMin,
    lowMax: lowMax,
    highMax: highMax,
    highMin: highMin,
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
function firstMin( req, res, cond ){ fetch( req, res, cond, ['min','first'] ) }
function firstMax( req, res, cond ){ fetch( req, res, cond, ['max','first'] ) }
function lastMin( req, res, cond ){ fetch( req, res, cond, ['min','last'] ) }
function lastMax( req, res, cond ){ fetch( req, res, cond, ['max','last'] ) }
function countMin( req, res, cond ){ fetch( req, res, cond, ['min','count'] ) }
function countMax( req, res, cond ){ fetch( req, res, cond, ['max','count'] ) }
function lowMin( req, res, cond ){ fetch( req, res, cond, ['min','low'] ) }
function lowMax( req, res, cond ){ fetch( req, res, cond, ['max','low'] ) }
function highMin( req, res, cond ){ fetch( req, res, cond, ['min','high'] ) }
function highMax( req, res, cond ){ fetch( req, res, cond, ['max','high'] ) }

function temp( req, res ){ res.status(500).json({ error: 'this route is temporarily disabled' }) }