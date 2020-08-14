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
			msg.reply.send("seria nu a fost gasita");
			return;
		}
		if(!(checkPermission(msg.member, 'ADMINISTRATORI') || checkPermission(msg.member,'TĂTICII MARI')))
		{
			msg.reply("nu ai permisiunile necesare pentru a folosi comanda");
			return;
		}
		if(args[1] == null)
		{
			msg.reply("trebuie sa specifici un episod");
			return;
		}
		series.traducere = 0;
		series.verificare = 0;
		series.typesetting = 0;
		series.encode = 0;
		series.episod = args[1];
	}
	else if(command == "update") // -update [serie] [stadiu] [optional: -not]
	{
		if(	!(checkPermission(msg.member, 'Traducător')) 	&& args[1] == "traducere"
		|| 	!(checkPermission(msg.member, 'Verificator')) 	&& args[1] == "verificare"
		||	!(checkPermission(msg.member, 'Typesetter')) 	&& args[1] == "typesetting"
		||	!(checkPermission(msg.member, 'Encode')) 		&& args[1] == "encode"
	  	)
		{
			msg.reply("nu ai permisiunile necesare pentru a folosi comanda");
			return;
		}
		
		if(series == null) 
		{
			msg.reply.send("seria nu a fost gasita");
			return;
		}
		

		let series = SearchJSONForKeyWord(onGoingSeries, args);
		let valoareViitoare = 1;

		if(args[2] == "-not")
			valoareViitoare = 0;
		switch(args[1])
		{
			case 'traducere': series.traducere = valoareViitoare; break;
			case 'verificare': series.verificare = valoareViitoare; break;
			case 'typesetting': series.typesetting = valoareViitoare; break;
			case 'encode': series.encode = valoareViitoare; break;
		}
		showProgres(msg, args);
	}
	else if(command == "progres")
	{
		showProgres(msg, args);
	}	
});

function checkPermission(user, roleNecessary)
{
	if(user.roles.cache.some(role => role.name === roleNecessary))
		return true;
	return false;
}

function showProgres(msg, args)
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
			{ name: 'Progres', value: boolToStrikeThrough(series.traducere, "Traducere") + ' \n' + boolToStrikeThrough(series.verificare, "Verificare") + ' \n' + boolToStrikeThrough(series.typesetting, "Typesetting") + ' \n' + boolToStrikeThrough(series.encode, "Encode")},
		)

		.setThumbnail(series.image)
		.setTimestamp();

		msg.channel.send(exampleEmbed);
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