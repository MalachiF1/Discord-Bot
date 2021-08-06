const Battleship = require('./battleship');
let ongoingGames = new Set();

const playBattleship = async (gameChannel, host) => {
	if (gameChannel.type === 'dm') return;
	if (ongoingGames.has(gameChannel.id)) {
		gameChannel.send('Game is ongoing');
		return;
	}
	ongoingGames.add(gameChannel.id);

	const getPlayer2 = async (gameChannel, host) => {
		gameChannel.send('Looking for second player. Use "!join battleship" to join.');
		let messages = await gameChannel.awaitMessages(
			message => {
				if (
					message.author.bot ||
					message.author.id === host.id ||
					message.content.trim().toLowerCase() !== '!join battleship'
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

	const getShot = async (battleship, gameChannel) => {
		let messages = await gameChannel.awaitMessages(
			message => {
				if (
					message.author.bot ||
					(message.author.id !== battleship.player1.id && message.author.id !== battleship.player2.id) ||
					message.content.trim().split(/\s+/)[0].toLowerCase() !== '!shoot'
				) {
					return false;
				}

				if (message.author.id !== battleship.turn.id) {
					gameChannel.send("It's not you turn.");
					return false;
				}

				let [command, row, col] = message.content.trim().split(/\s+/);

				if (
					!col ||
					!row ||
					col > 10 ||
					col < 1 ||
					row > 10 ||
					row < 1 ||
					!Number.isInteger(Number(col)) ||
					!Number.isInteger(Number(row))
				) {
					gameChannel.send('Please enter valid row and column numbers.');
					return false;
				}

				return true;
			},
			{ max: 1 }
		);

		let row = messages.first(1)[0].content.trim().split(/\s+/)[1];
		let column = messages.first(1)[0].content.trim().split(/\s+/)[2];
		row = 10 - Number(row);
		column = Number(column) - 1;
		return [row, column];
	};

	let player2 = await getPlayer2(gameChannel, host);

	const battleship = new Battleship(host, player2);
	battleship.generate();

	await gameChannel.send(
		`A battleship game has started between ${host} and ${player2}! Use "!shoot [row] [column]" to shoot down a square. Your boards will be sent to you in your DMs. ${battleship.turn} goes first.`
	);
	let dmChannel1 = await host.createDM();
	let dmChannel2 = await player2.createDM();
	let message1;
	let message2;

	dmChannel1
		.send(`${battleship.toString(battleship.enemyMap1)}\n${battleship.toString(battleship.board1)}`)
		.then(msg => (message1 = msg));
	dmChannel2
		.send(`${battleship.toString(battleship.enemyMap2)}\n${battleship.toString(battleship.board2)}`)
		.then(msg => (message2 = msg));
	while (true) {
		let [row, col] = await getShot(battleship, gameChannel);
		let shotResult = battleship.shoot(row, col);
		if (!shotResult[0]) {
			gameChannel.send(`${shotResult[1]}`);
		} else {
			if (battleship.ended()) break;
			if (message1) {
				message1
					.edit(`${battleship.toString(battleship.enemyMap1)} ${battleship.toString(battleship.board1)}`)
					.then(msg => (message1 = msg));
			} else {
				dmChannel1
					.send(`${battleship.toString(battleship.enemyMap1)} ${battleship.toString(battleship.board1)}`)
					.then(msg => (message1 = msg));
			}
			if (message2) {
				message2
					.edit(`${battleship.toString(battleship.enemyMap2)} ${battleship.toString(battleship.board2)}`)
					.then(msg => (message2 = msg));
			} else {
				dmChannel2
					.send(`${battleship.toString(battleship.enemyMap2)} ${battleship.toString(battleship.board2)}`)
					.then(msg => (message2 = msg));
			}
			gameChannel.send(`${shotResult[1]}${battleship.turn}'s turn`);
		}
	}
	gameChannel.send(
		`Game over, ${battleship.ended()} won!\n${battleship.player1}'s board:\n${battleship.toString(
			battleship.board1
		)}\n${battleship.player2}'s board:\n${battleship.toString(battleship.board2)}`
	);

	ongoingGames.delete(gameChannel.id);

	return;
};

module.exports = playBattleship;
