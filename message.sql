create table message
(
	`index` int auto_increment,
	id bigint not null,
	user_id bigint not null,
	channel_id bigint not null,
	content_length int not null,
	word_count int not null,
	emote_count int not null,
	mention_count int not null,
	has_everyone boolean not null,
	has_embed boolean not null,
	has_url boolean null,
	constraint message_pk
		primary key (`index`)
);