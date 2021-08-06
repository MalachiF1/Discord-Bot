const fetch = require('isomorphic-fetch');
const { MessageEmbed } = require('discord.js');

const chuckNorris = async (channel) => {

    const getQuote = () => {
    
        return fetch(`https://api.chucknorris.io/jokes/random`, {
            method: 'GET',
        })
            .then(async response => await response.json())
            .catch(async err => console.log(await err));
    };

    const jsonData = await getQuote();

    const chuckNorrisQuote = new MessageEmbed().setFooter(jsonData.value, jsonData.icon_url);
    channel.send(chuckNorrisQuote);

    return;
}



module.exports = chuckNorris;