const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs'); 
const token = JSON.parse(fs.readFileSync('token.json')).token;

client.login(token);


var text, onGoingSeries;
const prefix = '-';

client.on('ready', () => {
	text = fs.readFileSync('test.json',{encoding:'utf8'});
	onGoingSeries = JSON.parse(text);
});

client.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if(args.length == 0)
	{
		msg.reply("Nu ai introdus suficiente argumente :(");
	}
	else if(command == "progres")
	{
		var nume = SearchJSONForKeyWord(onGoingSeries, args);
		if(nume == null) 
		{
			msg.channel.send("Seria nu a fost gasita");
			return;
		}
		
		const exampleEmbed = new Discord.MessageEmbed()
		.setColor([150, 0, 255])
		.setTitle(nume + " #X")
		.addFields(
			{ name: 'Progres', value: 'Traducere \nVerificare \nTypesetting \nEncode' },
		)

		.setThumbnail('https://upload.wikimedia.org/wikipedia/en/f/f5/Inazumaeleven.orionnokokuin.animekeyvisual.jpg')
		.setTimestamp();

		msg.channel.send(exampleEmbed);
	}	
});


function SearchJSONForKeyWord(obj, keyword)
{
	for(var i = 0; i < obj.length; i++)
	{
		for(var j = 0; j < obj[i].keyWords.length; j++)
		{
			if(keyword.includes(obj[i].keyWords[j]))
				return obj[i].title;
		}
	}

	return null;
}

class Anime{
	
	constructor(title, keyWords)
	{
		this.title = title;
		this.keyWords = keyWords;
	}
}