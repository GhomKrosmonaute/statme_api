create table message
(
	`index` int auto_increment,
	id varchar(20) not null,
	user_id varchar(20) not null,
	guild_id varchar(20) not null,
	channel_id varchar(20) not null,
	content_length int not null,
	word_count int not null,
	emote_count int not null,
	mention_count int not null,
	has_everyone boolean not null,
	has_embed boolean not null,
	has_url boolean not null,
	created_timestamp timestamp default CURRENT_TIMESTAMP,
	constraint message_pk
		primary key (`index`)
);