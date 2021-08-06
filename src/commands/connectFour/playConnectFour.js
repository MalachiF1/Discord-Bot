const ConnectFour = require('./connectFour');
let ongoingGames = new Set();

const playConnectFour = async (gameChannel, host) => {
	if (gameChannel.type === 'dm') return;
	if (ongoingGames.has(gameChannel.id)) {
		gameChannel.send('Game is ongoing');
		return;
	}
	ongoingGames.add(gameChannel.id);

	let player = await getPlayer2(gameChannel, host);

	let connectFour = new ConnectFour(host, player);

	await gameChannel.send(
		`A connect4 game has started between ${host} and ${player}! Use "!drop [column number]" to drop a token in your desired column. ${connectFour.turn} goes first. ${connectFour}`
	);

	while (true) {
		let column = await getDrop(connectFour, gameChannel);
		let dropResult = connectFour.drop(column - 1);

		if (!dropResult) {
			gameChannel.send('Column is full, try a different one.');
		} else {
			if (connectFour.ended()) break;
			gameChannel.send(`${connectFour.turn}'s turn. ${connectFour}`);
		}
	}
	if (connectFour.ended() === 'tie') {
		gameChannel.send(`Game over! it's a tie. ${connectFour}`);
	} else {
		gameChannel.send(`Game over! ${connectFour.lastMove[3]} won. ${connectFour}`);
	}

	ongoingGames.delete(gameChannel.id);
	return;
};

const getPlayer2 = async (gameChannel, host) => {
	gameChannel.send('Looking for second player. Use "!join connect4" to join.');
	let messages = await gameChannel.awaitMessages(
		message => {
			if (
				message.author.bot ||
				message.author.id === host.id ||
				message.content.trim().toLowerCase() !== '!join connect4'
			) {
				return false;
			}

			return true;
		},
		{ max: 1 }
	);

	let player = messages.first(1)[0].author;
	return player;
};

const getDrop = async (connectFour, gameChannel) => {
	let messages = await gameChannel.awaitMessages(
		message => {
			if (
				message.author.bot ||
				(message.author.id !== connectFour.player1.id && message.author.id !== connectFour.player2.id) ||
				message.content.trim().split(/\s+/)[0].toLowerCase() !== '!drop'
			) {
				return false;
			}

			if (message.author.id !== connectFour.turn.id) {
				gameChannel.send("It's not you turn.");
				return false;
			}

			let [command, ...col] = message.content.trim().split(/\s+/);
			col = col.join(' ');

			if (!col || col > 7 || col < 1 || !Number.isInteger(Number(col))) {
				gameChannel.send('Please enter a valid column number.');
				return false;
			}

			return true;
		},
		{ max: 1 }
	);

	let column = messages.first(1)[0].content.trim().split(/\s+/)[1];
	return Number(column);
};

module.exports = playConnectFour;
