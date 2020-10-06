const Hangman = require('./hangman');
let ongoingGames = new Set();

const playHangman = async (gameChannel, host) => {
	if (gameChannel.type === 'dm') return;
	if (ongoingGames.has(gameChannel.id)) {
		gameChannel.send('Game is ongoing');
		return;
	}
	ongoingGames.add(gameChannel.id);
	gameChannel.send(`I've DM'd you ${host}, please respond over there with the phrase you would like to setup.`);

	let phrase = await getPhrase(host);
	let hangman = new Hangman(phrase);
	gameChannel.send(`A hangman game has started! use "!guess [guess]" to guess a letter or the phrase. ${hangman}`);

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

const getPhrase = async host => {
	let dmChannel = await host.createDM();
	dmChannel.send('Reply with the phrase you want to setup.');
	let messages = await dmChannel.awaitMessages(
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
	);

	let phrase = messages.first(1)[0].content.trim();
	return phrase;
};

const validatePhrase = message => {
	const messageLength = message.content.replace(' ', '').length;

	if (messageLength > 25 || messageLength < 4) {
		return {
			valid: false,
			message: 'Phrase must be between 4 and 25 characters long. Please reply with a different phrase.',
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

const getGuess = async (hangman, gameChannel) => {
	let messages = await gameChannel.awaitMessages(
		message => {
			if (message.author.bot || !ongoingGames.has(gameChannel.id)) return false;

			let [command, ...guess] = message.content.trim().split(/\s+/);
			guess = guess.join(' ').trim();
			if (command.toLowerCase() !== '!guess') return false;

			let validationResult = hangman.validate(guess);
			if (!validationResult.valid) {
				channel.send(`${validationResult.message}`);
			} else {
				return true;
			}
		},
		{ max: 1 }
	);

	let message = messages.first(1)[0].content;
	let [command, ...guess] = message.trim().split(/\s/);
	guess = guess.join(' ').trim();
	return guess;
};

module.exports = playHangman;
