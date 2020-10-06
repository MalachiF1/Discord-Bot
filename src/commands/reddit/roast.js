const fetch = require('isomorphic-fetch');

const roastuser = async (message, botId) => {
	if (message.channel.type === 'dm') return;

	const VALID_AT_LENGTH = [21, 22];
	const MIN_TITLE_LENGTH = 7;
	const MAX_TITLE_LEBGTH = 140;

	[command, ...user] = message.content.trim().split(/\s+/);
	if (user.length !== 1) return;
	user = user[0];

	if (!user.startsWith('<@') || !user.endsWith('>') || VALID_AT_LENGTH.indexOf(user.length) === -1) return;

	let jsonData = await getRoasts();
	let roasts = jsonData.data.children.filter(current => {
		if (
			current.data.stickied ||
			current.data.title.length < MIN_TITLE_LENGTH ||
			current.data.title.length > MAX_TITLE_LEBGTH ||
			current.data.title.indexOf('reddit') !== -1 ||
			current.data.selftext
		) {
			return false;
		}

		return true;
	});

	let randNum = Math.floor(Math.random() * roasts.length);
	let roast = roasts[randNum].data.title;

	if (user === `<@!${botId}>`) {
		message.channel.send(`No. Also ${message.author}, ${roast}`);
	} else {
		message.channel.send(`${user} ${roast}`);
	}

	return;
};

const getRoasts = async () => {
	return fetch(`https://www.reddit.com/r/insults/top/.json?t=all&limit=50`, {
		method: 'GET',
	})
		.then(async response => await response.json())
		.catch(async err => console.log(await err));
};

module.exports = roastuser;
