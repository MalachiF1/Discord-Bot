const TicTactToe = require('./ticTacToe');
let ongoingGames = new Set();

const playTicTactToe = async (gameChannel, host) => {
	if (gameChannel.type === 'dm') return;
	if (ongoingGames.has(gameChannel.id)) {
		gameChannel.send('Game is ongoing');
		return;
	}
	ongoingGames.add(gameChannel.id);

	let player = await getPlayer2(gameChannel, host);

	let ticTactToe = Math.random() > 0.5 ? new TicTactToe(host, player) : new TicTactToe(player, host);

	await gameChannel.send(
		`A tic-tac-toe game has started between ${host} and ${player}! Use "!play [row] [column]" to place a token in your desired postions. ${ticTactToe.turn} goes first. ${ticTactToe}`
	);

	while (true) {
		let position = await getPlay(ticTactToe, gameChannel);

		let playResult = ticTactToe.play(position, ticTactToe.turn.id);

		if (!playResult) {
			gameChannel.send('That position is taken, try a different one.');
		} else {
			if (ticTactToe.ended()) break;
			gameChannel.send(`${ticTactToe.turn}'s turn. ${ticTactToe}`);
		}
	}
	if (ticTactToe.ended() === 'tie') {
		gameChannel.send(`Game over! It's a tie. ${ticTactToe}`);
	} else {
		gameChannel.send(`Game over! ${ticTactToe.lastMove[3]} won. ${ticTactToe}`);
	}

	ongoingGames.delete(gameChannel.id);
	return;
};

const getPlayer2 = async (gameChannel, host) => {
	gameChannel.send('Looking for second player. Use "!join tictactoe" to join.');
	let messages = await gameChannel.awaitMessages(
		message => {
			if (message.author.bot || message.author.id === host.id || message.content.trim() !== '!join tictactoe') {
				return false;
			}

			return true;
		},
		{ max: 1 }
	);

	let player = messages.first(1)[0].author;
	return player;
};

const getPlay = async (ticTacToe, gameChannel) => {
	let messages = await gameChannel.awaitMessages(
		message => {
			if (
				message.author.bot ||
				(message.author.id !== ticTacToe.player1.id && message.author.id !== ticTacToe.player2.id) ||
				message.content.trim().split(/\s+/)[0] !== '!play'
			) {
				return false;
			}

			if (message.author.id !== ticTacToe.turn.id) {
				gameChannel.send("It's not you turn.");
				return false;
			}

			let [command, ...pos] = message.content.trim().split(/\s+/);

			if (
				!pos[0] ||
				!pos[1] ||
				pos[0] > 3 ||
				pos[0] < 1 ||
				pos[1] > 3 ||
				pos[1] < 1 ||
				!Number.isInteger(Number(pos[0])) ||
				!Number.isInteger(Number(pos[1]))
			) {
				gameChannel.send('Please enter a valid position.');
				return false;
			}

			return true;
		},
		{ max: 1 }
	);

	let [command, ...pos] = messages.first(1)[0].content.trim().split(/\s+/);
	return [Number(pos[0]) - 1, Number(pos[1]) - 1];
};

module.exports = playTicTactToe;
