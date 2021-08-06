const russianRoulette = async (message) => {

    const member = await message.guild.members.fetch(message.author.id).catch(member => {
		if (!member) {
			console.log('Memeber not found');
			return;
		}
	});

    if (!member.bannable) {
		message.channel.send("I don't have permission to ban you.");
		return;
	};

    const deathMessage = () => {
        const deathMessages = [
            'Get Banned!',
            `${member.nickname} Got the L`,
            `${member.nickname} is gone.`,
            'Better luck next time... oh wait.',
            'Who\'s next?'
        ]

        return deathMessages[Math.floor(Math.random() * deathMessages.length)]
    };

    const liveMessage = () => {
        const liveMessages = [
            'Not banned today bucko',
            'Congrats, you live.',
            'The next chamber is also empty, I promise.',
            'Play agian Pussy.',
            'The Odds were in your favour.',
        ]

        return liveMessages[Math.floor(Math.random() * liveMessages.length)]
    };
    
    const coinFlip = Math.floor(Math.random() * 3);
    if (coinFlip === 0) {member.ban({ reason: 'russian roulette' }).then(() => message.channel.send(`\`Bang! ${deathMessage()}\``))}
    else if (coinFlip === 1 || coinflip === 2) {message.channel.send(`\`Click! ${liveMessage()}\``)}
    else {console.log('error, coinflip failed')}
}

module.exports = russianRoulette;