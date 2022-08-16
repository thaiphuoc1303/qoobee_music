require('module-alias/register');

const { Client } = require('discord.js');
const prism = require('prism-media');
const config = require('./config.json');
const ytdl = require('ytdl-core');
const express = require('express');
const port = 3000;
const app = express();
app.get('/', function (req, res) {
	res.send('Hello World');
 });
 app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
  });
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
    'https://www.youtube.com/watch?v=t1ik7LTG5TI&list=PLhL1LHsxYkZWsFa0iY1Qo94BIxot5z2-K&index=1&t=2s',
    'https://www.youtube.com/watch?v=znSEP-SXzjM&list=PLhL1LHsxYkZWsFa0iY1Qo94BIxot5z2-K&index=2&t=213s',
    'https://www.youtube.com/watch?v=2Ng5o-8YleM&list=PLhL1LHsxYkZWsFa0iY1Qo94BIxot5z2-K&index=3&t=2471s'
];
var position = 0;

// const player = createAudioPlayer({
// 	behaviors: {
// 		noSubscriber: NoSubscriberBehavior.Play,
// 		maxMissedFrames: Math.round(config.maxTransmissionGap / 20),
// 	},
// });

const player = createAudioPlayer();
function playSong(url) {
	const resource = createAudioResource(
        ytdl(url),
      );
    
    player.play(resource);
    entersState(player, AudioPlayerStatus.Playing, 5e3);
}


player.on('stateChange', (oldState, newState) => {
	if (oldState.status === AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Playing) {
		console.log('Playing audio output on audio player');
	} else if (newState.status === AudioPlayerStatus.Idle) {
		// console.log('Playback has stopped. Attempting to restart.');
		// attachRecorder();
        position++;
        if (position == playlist.length) position = 0;
        playSong(playlist[position]);
	}
});

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
	console.log('discord.js client is ready!');
	playSong(playlist[position]);
});

client.on('messageCreate', async (message) => {
	if (!message.guild) return;
	if (message.content === '-join') {
		const channel = message.member?.voice.channel;
		if (channel) {
			try {
				const connection = await connectToChannel(channel);
				connection.subscribe(player);
                
				await message.reply('Playing now!');
			} catch (error) {
				console.error(error);
			}
		} else {
			await message.reply('Join a voice channel then try again!');
		}
	}
});

void client.login(config.token);