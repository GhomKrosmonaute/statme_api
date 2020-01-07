
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
            aliases: [ '/message/user/:user_id/' ],
            actions: ['first','last','count','max','min'],
            result: 'all user messages'
        },
        {
            aliases: [ '/message/guild/:guild_id/' ],
            actions: ['first','last','count','max','min'],
            result: 'all guild messages'
        },
        {
            aliases: [ '/message/guild/:guild_id/user/:user_id/' ],
            actions: ['first','last','count'],
            result: 'all member messages'
        }
    ]
}

module.exports = routes



