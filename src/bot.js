require('dotenv').config();
const { Client } = require('discord.js');
const playHangman = require('./commands/hangman/playHangman');
const getMeme = require('./commands/reddit/getMemes');
const roastUser = require('./commands/reddit/roast');
const eightBall = require('./commands/eightBall');
const playConnectFour = require('./commands/connectFour/playConnectFour');
const help = require('./commands/help');
const playTicTacToe = require('./commands/ticTacToe/playTicTacToe');
const kick = require('./commands/mod/kick');
const ban = require('./commands/mod/ban');
const lenny = require('./commands/lenny');
const russianRoulette = require('./commands/russianRoulette');
const chuckNorris = require('./commands/chuckNorris');
const playBattleship = require('./commands/battleship/playBattleship');

const client = new Client();

client.login(process.env.DISCORDJS_BOT_TOKEN);

client.on('ready', () => {
	console.log(`${client.user.tag} has logged in`);
});

client.on('message', message => {
	if (message.guild) {
		const botUser = message.guild.member(client.user);
		if (!botUser.permissionsIn(message.channel).has('SEND_MESSAGES')) return;
	}
	if (message.author.bot) return;

	const command = message.content.trim().toLowerCase();
	if (command === '!help') help(message.channel);
	if (command === '!hangman') playHangman(message.channel, message.author);
	if (command === '!tictactoe') playTicTacToe(message.channel, message.author);
	if (command === '!connect4') playConnectFour(message.channel, message.author);
	if (command === '!dankmeme') getMeme('dankmemes', message.channel);
	if (command === '!historymeme') getMeme('HistoryMemes', message.channel);
	if (command === '!prequelmeme') getMeme('PrequelMemes', message.channel);
	if (command === '!meme') getMeme('random', message.channel);
	if (command === '!lenny') lenny(message.channel);
	if (command === '!russian roulette') russianRoulette(message);
	if (command === '!chuck norris') chuckNorris(message.channel);
	if (command === '!battleship') playBattleship(message.channel, message.author);
	if (command.split(/\s+/)[0] === '!roast') roastUser(message, client.user.id);
	if (command.split(/\s+/)[0] === '!8ball') eightBall(message);
	if (command.split(/\s+/)[0] === '!kick') kick(message);
	if (command.split(/\s+/)[0] === '!ban') ban(message);
	return;
});
