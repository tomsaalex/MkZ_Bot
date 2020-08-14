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
	else if(command == "start")
	{
		let series = SearchJSONForKeyWord(onGoingSeries, args);
		if(series == null) 
		{
			msg.channel.send("Seria nu a fost gasita");
			return;
		}

		series.traducere = 0;
		series.verificare = 0;
		series.typesetting = 0;
		series.encode = 0;
		series.episod = args[1];
	}
	else if(command == "progres")
	{
		let series = SearchJSONForKeyWord(onGoingSeries, args);
		if(series == null) 
		{
			msg.channel.send("Seria nu a fost gasita");
			return;
		}
		

		const exampleEmbed = new Discord.MessageEmbed()
		.setColor([150, 0, 255])
		.setTitle(series.title + ' #' + series.episod)
		.addFields(
			//{ name: 'Progres', value: "Traducere "  + boolToEmote(series.traducere) + '\nVerificare ' + boolToEmote(series.verificare) + '\nTypesetting ' + boolToEmote(series.typesetting) + '\nEncode ' + boolToEmote(series.encode)},
			{ name: 'Progres', value: boolToStrikeThrough(series.traducere, "Traducere") + ' \n' + boolToStrikeThrough(series.verificare, "Verificare") + ' \n' + boolToStrikeThrough(series.typesetting, "Typesetting") + ' \n' + boolToStrikeThrough(series.encode, "Encode")},
		)

		.setThumbnail(series.image)
		.setTimestamp();

		msg.channel.send(exampleEmbed);
	}	
});


function boolToEmote(value)
{
	if(value == 1)
	{
		return ":white_check_mark:";
	}
		return ":x:";
}

function boolToStrikeThrough(value, text)
{
	if(value == 1)
	{
		return '~~' + text + '~~';
	}
	return text;
}

function SearchJSONForKeyWord(obj, keyword)
{
	let series = new Anime();

	for(var i = 0; i < obj.length; i++)
	{
		for(var j = 0; j < obj[i].keyWords.length; j++)
		{
			if(keyword.includes(obj[i].keyWords[j]))
				{
					/*series.title = obj[i].title;
					series.image = obj[i].image;
					series.traducere = obj[i].traducere;
					series.verificare = obj[i].verificare;
					series.typesetting = obj[i].typesetting;
					series.encode = obj[i].encode;
					series.episod = obj[i].episod;
					return series;
					*/
					return obj[i];
				}
		}
	}

	return null;
}

class Anime{
	
	constructor(title, keyWords, image, traducere, verificare, typesetting, encode, episod)
	{
		this.title = title;
		this.keyWords = keyWords;
		this.image = image;
		this.episod = episod;
		this.traducere = traducere;
		this.verificare = verificare;
		this.typesetting = typesetting;
		this.encode = encode;
	}
}