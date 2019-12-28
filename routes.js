
const routes = {
    v1: [
        {
            aliases: [ '/message/all/' ],
            actions: ['first','last','count'],
            result: 'all messages'
        },
        {
            aliases: [ '/message/id/:message_id/' ],
            actions: ['max','min'],
            result: 'the message'
        },
        {
            aliases: [
                '/message/user/:user_id/',
                '/message/author/:user_id/'
            ],
            actions: ['first','last','count','max','min'],
            result: 'all user messages'
        },
        {
            aliases: [
                '/message/guild/:guild_id/',
                '/message/server/:guild_id/'
            ],
            actions: ['first','last','count','max','min'],
            result: 'all guild messages'
        },
        {
            aliases: ['/message/member/:guild_id/:user_id/'],
            actions: ['first','last','count'],
            result: 'all member messages'
        },
        {
            aliases: ['/message/words/:word_count/'],
            actions: ['first','last','count','max','min','low','high'],
            result: 'all messages with {word_count} words'
        },
        {
            aliases: ['/message/length/:length/'],
            actions: ['first','last','count','max','min','low','high'],
            result: 'all {length}-letter long messages'
        },
        {
            aliases: ['/message/everyone/'],
            conditions: ['`has_everyone` = 1'],
            actions: ['first','last','count'],
            result: 'all message that mention everyone'
        }
    ]
}

module.exports = routes



