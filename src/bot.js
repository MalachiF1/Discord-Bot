require('dotenv').config();
const { Client } = require('discord.js');
const playHangman = require('./commands/hangman/playHangman');
const getMeme = require('./commands/reddit/getMemes');
const roastUser = require('./commands/reddit/roast');
const eightBall = require('./commands/eightBall');
const playConnectFour = require('./commands/connectFour/playConnectFour');
const help = require('./commands/help');
const playTicTacToe = require('./commands/ticTacToe/playTicTacToe');

const client = new Client();

client.login(process.env.DISCORDJS_BOT_TOKEN);

client.on('ready', () => {
	console.log(`${client.user.tag} has logged in`);
});

client.on('message', message => {
	const botUser = message.guild.member(client.user);

	if (message.author.bot || !botUser.permissionsIn(message.channel).has('SEND_MESSAGES')) return;

	const command = message.content.trim().toLowerCase();
	if (command === '!help') help(message.channel);
	if (command === '!hangman') playHangman(message.channel, message.author);
	if (command === '!tictactoe') playTicTacToe(message.channel, message.author);
	if (command === '!connect4') playConnectFour(message.channel, message.author);
	if (command === '!dankmeme') getMeme('dankmemes', message.channel);
	if (command === '!historymeme') getMeme('HistoryMemes', message.channel);
	if (command === '!prequelmeme') getMeme('PrequelMemes', message.channel);
	if (command === '!meme') getMeme('random', message.channel);
	if (command.split(/\s+/)[0] === '!roast') roastUser(message, client.user.id);
	if (command.split(/\s+/)[0] === '!8ball') eightBall(message.content);
	return;
});
