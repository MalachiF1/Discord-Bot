const kick = async message => {
	[command, ...args] = message.content.trim().split(/\s+/);
	const user = args[0];
	const reason = args[1] ? args[1] : '';

	if (!user) {
		message.channel.send('Please provide a user ID');
		return;
	}

	const member = await message.guild.members.fetch(user).catch(member => {
		if (!member) {
			message.channel.send('Memeber not found');
			return;
		}
	});

	if (!message.member.hasPermission('KICK_MEMBERS')) {
		message.channel.send("You don't have permission to do that.");
		return;
	}

	if (!member.kickable) {
		message.channel.send("I don't have permission to do that.");
		return;
	}

	member.kick(`${reason}`).then(member => message.channel.send(`${member} was kicked`));
};

module.exports = kick;
