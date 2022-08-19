require('module-alias/register');

const { Client, Guild } = require('discord.js');
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
	'https://www.youtube.com/watch?v=2YllmPaKhkY',
	
	'https://www.youtube.com/watch?v=xIEhVH7wQw4',
	'https://www.youtube.com/watch?v=yNQ6FtRnLPc',
	'https://www.youtube.com/watch?v=9V3IgiERE9I',
	'https://www.youtube.com/watch?v=jETECLiAF3o',
	'https://www.youtube.com/watch?v=V3MA_YojrYM',
	'https://www.youtube.com/watch?v=ZEHGLxNKpk0',
	'https://www.youtube.com/watch?v=l1nlJnIze8M',
	'https://www.youtube.com/watch?v=L07GgpoT0GE',
	'https://www.youtube.com/watch?v=ritnXLZHgmc',
	'https://www.youtube.com/watch?v=Ov28PsV-4Dw',
	'https://www.youtube.com/watch?v=0tX_UnzmOtg'
];

function setStatusClient (){
	var time = new Date().getHours();
	if (time > 0 && time < 6){
		client.user.setPresence({ activities: [{ 
			name: 'lofi music',
			type :'LISTENING'
		}], status: 'online' });
	}
	else if (time >= 6 && time < 9){
		client.user.setPresence({ activities: [{ 
			name: 'EDM',
			type :'LISTENING'
		}], status: 'online' });
	}
	else if (time >= 9 && time < 12){
		client.user.setPresence({ activities: [{ 
			name: 'US/UK',
			type :'LISTENING'
		}], status: 'online' });
	}
	else if (time >= 12 && time < 15){
		client.user.setPresence({ activities: [{ 
			name: 'Kpop',
			type :'LISTENING'
		}], status: 'online' });
	}
	else if (time >= 15 && time < 18){
		client.user.setPresence({ activities: [{ 
			name: 'balad',
			type :'LISTENING'
		}], status: 'online' });
	}
	else if (time >= 18){
		client.user.setPresence({ activities: [{ 
			name: 'EDM',
			type :'LISTENING'
		}], status: 'online' });
	}
}

async function getResouce(link){
	try{
		// const r = await createAudioResource(ytdl(
		// 	link,
		// 	{
		// 		o: '-',
		// 		q: '',
		// 		f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
		// 		r: '100K',
		// 	},
		// 	{ stdio: ['ignore', 'pipe', 'ignore'] }, 
		// 	{filter: "audioonly"}
		// ));

		// const r = createAudioResource(await ytdl(link, {filter: "audioonly"}))

        const stream = await play.stream(link);
        const r = createAudioResource(stream.stream, {
            inputType: stream.type
        });
		return r;
	} catch(error){

	}
	
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
	// develop
	client.user.setPresence({ activities: [{ 
		name: '🧑‍💻Visual Studio Code with Qoobee',
		type :'PLAYING'
	}], status: 'online' });

	//deploy
	// setStatusClient();
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
				var position =0;

				getResouce(playlist[position]).then(
					function(value){
						player.play(value);
						entersState(player, AudioPlayerStatus.Playing, 5e3);
					},
					function(err){

					}
				);
				
				// player event

				player.on('error', ()=>{
					
				});
				
				player.on('stateChange', (oldState, newState) => {
					try {
						if (oldState.status === AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Playing) {
							console.log('Playing audio output on audio player');
						} else if (newState.status === AudioPlayerStatus.Idle) {
							position++;
							if (position == playlist.length) position = 0;

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
	else if (message.content === '-next') {

	}
	else {
		if (message.author.id != Guild.ownerId) {

		}
	}
});

void client.login(config.token_developing);