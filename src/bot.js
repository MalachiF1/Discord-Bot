require('dotenv').config();
const { Client } = require('discord.js');
const Hangman = require('./hangman');

const client = new Client();
client.login(process.env.DISCORDJS_BOT_TOKEN);

client.on('ready', () => {
	console.log(`${client.user.tag} has logged in`);
});

let ongoingGames = new Set();

client.on('message', message => {
	if (message.author.bot || message.channel.type === 'dm' || message.content.trim() !== '!hangman') return;
	if (ongoingGames.has(message.channel.id)) {
		message.channel.send('Game is ongoing');
		return;
	}
	playHangman(message.channel, message.author);
});

const playHangman = async (gameChannel, host) => {
	ongoingGames.add(gameChannel.id);
	gameChannel.send(`I've DM'd you ${host}, please respond over there with the phrase you would like to setup.`);

	let phrase = await getPhrase(host);
	let hangman = new Hangman(phrase);
	gameChannel.send(`A hangman game has started! use !guess to guess a letter or the phrase. ${hangman}`);

	while (true) {
		let guess = await getGuess(hangman, gameChannel);
		hangman.guess(guess);

		if (hangman.status().ended) break;

		gameChannel.send(`${hangman}`);
	}

	if (hangman.status().won) {
		gameChannel.send(`Game over! you won :) ${hangman}`);
	} else {
		gameChannel.send(`Game over! you lost :( ${hangman} The phrase was "${hangman.phrase}"`);
	}

	ongoingGames.delete(gameChannel.id);
};

const getPhrase = host => {
	return new Promise((resolve, reject) => {
		host.createDM().then(dmChannel => {
			dmChannel.send('Reply with the phrase you want to setup.');
			dmChannel
				.awaitMessages(
					message => {
						if (message.author.bot || message.channel.id !== dmChannel.id) return false;

						let validationResult = validatePhrase(message);
						if (!validationResult.valid) {
							dmChannel.send(validationResult.message);
							return false;
						}

						return true;
					},
					{ max: 1 }
				)
				.then(messages => {
					let phrase = messages.first(1)[0].content.trim();
					resolve(phrase);
				});
		});
	});
};

const validatePhrase = message => {
	const messageLength = message.content.replace(' ', '').length;

	if (messageLength > 20 || messageLength < 4) {
		return {
			valid: false,
			message: 'Phrase must be between 4 and 20 characters long. Please reply with a different phrase.',
		};
	} else if (!/^[a-z ]+$/.test(message.content.trim())) {
		return {
			valid: false,
			message: 'Phrase can only contain lowercase letters. Please reply with a different phrase.',
		};
	}

	return {
		valid: true,
		message: null,
	};
};

const getGuess = (hangman, gameChannel) => {
	return new Promise((resolve, reject) => {
		gameChannel
			.awaitMessages(
				message => {
					if (message.author.bot || !ongoingGames.has(gameChannel.id)) return false;

					let [command, ...guess] = message.content.trim().split(/\s+/);
					guess = guess.join(' ').trim();
					if (command !== '!guess') return false;

					let validationResult = hangman.validate(guess);
					if (!validationResult.valid) {
						channel.send(`${validationResult.message}`);
					} else {
						return true;
					}
				},
				{ max: 1 }
			)
			.then(messages => {
				let message = messages.first(1)[0].content;
				let [command, ...guess] = message.trim().split(/\s/);
				guess = guess.join(' ').trim();
				resolve(guess);
			});
	});
};
