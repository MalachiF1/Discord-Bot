const { MessageEmbed } = require('discord.js');

const help = channel => {
 
	let commands = new MessageEmbed()
		.setTitle('Commands')
		.setDescription(
			`
    All commands are case insensitive.\n
    \`!help\` : lists all Happy Driod\'s commands.\n
    \`!hangman\` : starts a game of hangman in the channel.\n
    \`!tictactoe\` : starts a game of tic-tac-toe in the channel.\n
    \`!connect4\` : starts a game of connect4 in the channel.\n
    \`!dankmeme\` : sends a meme from r/dankmemes.\n
    \`!historymeme\` : sends a meme from r/HistroryMemes.\n
    \`!prequelmeme\` : sends a meme from r/PrequelMemes.\n
    \`!meme\` : sends a meme from r/dankmemes, r/HistroryMemes, or r/PrequelMeme.\n
    \`!roast [@someone]\` : makes the bot roast the person you @.\n
    \`!8ball [question]\` : bot answers your question with one an 8ball answer.\n
    \`!lenny\` : sends a lenny in the channel.\n
    \`!russian roulette\` : Take your chances.\n
    \`!chuck norris\` : sends a chuck norris joke in the channel.\n
    Mod Commands:\n
    \`!kick [ID] [reason (not required)]\` : kicks the user from the server.\n
    \`!ban [ID] [reason (not required)]\` : bans the user from the server.
    `
		)
		.setColor('#246224');

	channel.send(commands);
	return;
};

module.exports = help;
