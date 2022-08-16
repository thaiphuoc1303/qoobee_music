require('module-alias/register');

const { Client } = require('discord.js');
const prism = require('prism-media');
const config = require('./config.json');
const ytdl = require('ytdl-core');
const express = require('express');
const play = require('play-dl');
const port = 3000;
const app = express();
app.get('/', function (req, res) {
	res.send('Hello World');
 });
 app.listen(process.env.PORT, '0.0.0.0');
const {
	NoSubscriberBehavior,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	entersState,
	AudioPlayerStatus,
	VoiceConnectionStatus,
	joinVoiceChannel,
} = require('@discordjs/voice');

const playlist = [
    'https://www.youtube.com/watch?v=DWYwmTdXpqw',
    'https://www.youtube.com/watch?v=UqKVL56IJB8',
	'https://www.youtube.com/watch?v=g20t_K9dlhU',
	'https://www.youtube.com/watch?v=pSFXJ7teisw',
	'https://www.youtube.com/watch?v=2YllmPaKhkY'
];

function nextSong (){
	var time = new Date().getHours();
	if (time > 0 && time < 6){

	}
	else if (time >= 6 && time < 9){

	}
	else if (time >= 9 && time < 12){

	}
	else if (time >= 12 && time < 15){

	}
	else if (time >= 15 && time < 18){

	}
	else if (time >= 18){

	}
}

async function getResouce(link){
	
	// const r = await createAudioResource(ytdl(
	// 	link,
	// 	{
	// 		o: '-',
	// 		q: '',
	// 		f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
	// 		r: '100K',
	// 	},
	// 	{ stdio: ['ignore', 'pipe', 'ignore'] },
	// ));
	const r = createAudioResource(await ytdl(link, {filter: "audioonly"}))
	return r;
}

async function connectToChannel(channel) {
	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator,
	});
	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 30000);
		return connection;
	} catch (error) {
		connection.destroy();
		throw error;
	}
}

const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'] });

client.on('ready', async () => {
	console.log('Qoobee music is ready!');
});

client.on('messageCreate', async (message) => {
	if (!message.guild) return;
	if (message.content === '-join') {
		const channel = message.member?.voice.channel;
		if (channel) {
			try {
				const connection = await connectToChannel(channel);
				const player = createAudioPlayer({
					behaviors: {
						noSubscriber: NoSubscriberBehavior.Play
					}
				});
				var position = Math.floor(Math.random() * playlist.length);

				getResouce(playlist[position]).then(
					function(value){
						player.play(value);
					},
					function(err){

					}
				);

				// const resource = createAudioResource(
				// 	ytdl(playlist[position], {filter: "audioonly"}),
				// );
				
				// player.play(resource);
				entersState(player, AudioPlayerStatus.Playing, 5e3);

				// player event
				
				player.on('stateChange', (oldState, newState) => {
					try {
						if (oldState.status === AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Playing) {
							console.log('Playing audio output on audio player');
						} else if (newState.status === AudioPlayerStatus.Idle) {
							position++;
							if (position == playlist.length) position = 0;


							const newResource = createAudioResource(
								ytdl(playlist[position], {filter: "audioonly"}),
							);
							getResouce(playlist[position]).then(
								function(value){
									player.play(value);
								},
								function(err){

								}
							);
							// player.play(newResource);
						}
					} catch(error){
						console.log(error);
						
					}
					
				});

				connection.subscribe(player);
                
				await message.reply('Playing now!');
			} catch (error) {
				console.error(error);
			}
		} else {
			await message.reply('Join a voice channel then try again!');
		}
	}
	if (message.content === '-next') {

	}
});

void client.login(config.token);