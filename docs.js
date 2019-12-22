
const mysql = require('mysql2')

module.exports = {
    props: {
        v1: [
            {
                name: 'message_id',
                type: 'SnowFlake',
                comment: 'Discord Message id',
                example: '<code>658433464626053165</code>',
                default: '658433464626053165'
            },
            {
                name: 'user_id',
                type: 'SnowFlake',
                comment: 'Discord User id',
                example: '<code>352176756922253321</code>',
                default: '352176756922253321'
            },
            {
                name: 'props',
                type: 'Columns',
                comment: 'Needed properties separate by <code>|</code>',
                example: 'id<code>|</code>word_count<code>|</code>length',
                default: 'id|word_count|content_length'
            }
        ]
    },
    types: {
        SnowFlake: {
            validation: arg => arg && /^\d{18,}$/.test(arg) ? `'${arg}'` : false
        },
        Columns: {
            validation: arg => {
                if(!arg) return false
                const cols = arg.split(/%7C|\|/).map(a => {
                    return mysql.escape(a).replace(/'/g,'`').trim()
                })
                return cols.length > 0 ? cols.join(', ') : false
            }
        }
    }

}