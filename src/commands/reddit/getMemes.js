const fetch = require('isomorphic-fetch');
const { MessageEmbed } = require('discord.js');

const getMeme = async (subreddit, channel) => {
	let jsonData = await getPosts(subreddit);

	posts = jsonData.data.children.filter(current => {
		if (current.data.stickied || !current.data.url) return false;
		return true;
	});

	randNum = Math.floor(Math.random() * posts.length);
	let post = posts[randNum].data;

	let meme = new MessageEmbed().setTitle(post.title).setImage(post.url);
	channel.send(meme);

	return;
};

const getPosts = subreddit => {
	if (subreddit === 'random') {
		subreddit = ['dankmemes', 'HistoryMemes', 'PrequelMemes'][Math.floor(Math.random() * 3)];
	}

	return fetch(`https://www.reddit.com/r/${subreddit}/hot/.json?limit=50`, {
		method: 'GET',
	})
		.then(async response => await response.json())
		.catch(async err => console.log(await err));
};

module.exports = getMeme;
