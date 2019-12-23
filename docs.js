
const mysql = require('mysql2')

module.exports.v1 = {
    props: [
        {
            name: 'message_id',
            type: 'SnowFlake',
            comment: 'Discord Message id',
            example: '<code>658433464626053165</code>',
            default: '658433464626053165',
            corresponding: 'id'
        },
        {
            name: 'user_id',
            type: 'SnowFlake',
            comment: 'Discord User id',
            example: '<code>352176756922253321</code>',
            default: '352176756922253321',
            corresponding: 'user_id'
        },
        {
            name: 'guild_id',
            type: 'SnowFlake',
            comment: 'Discord Guild id',
            example: '<code>507389389098188820</code>',
            default: '507389389098188820',
            corresponding: 'guild_id'
        },
        {
            name: 'word_count',
            type: 'Number',
            comment: 'Number of words wanted',
            example: '<code>5</code>',
            default: '5',
            corresponding: 'word_count'
        },
        {
            name: 'length',
            type: 'Number',
            comment: 'Message content length',
            example: '<code>25</code>',
            default: '25',
            corresponding: 'content_length'
        }
    ],
    types: {
        SnowFlake: {
            validation: arg => arg && /^\d{18,}$/.test(arg) ? `'${arg}'` : false
        },
        Number: {
            validation: arg => isNaN(Number(arg)) ? false : Number(arg)
        }
    }
}