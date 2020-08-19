const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs'); 
const token = JSON.parse(fs.readFileSync('token.json')).token;
const Avatar = 'http://manga-kids.com/wp-content/uploads/2020/08/Hereisararerobotpepe_d7d99eaf4edf4b0adae514bcc94ce151.png';

/*
const mainServerID = "313373031022198786";
const mainChannelID = "313377181768089611";
*/


const mainServerID = "595184419950559233";
const mainChannelID = "595184420382834688";

var mainChannel;

client.login(token);

var text, onGoingSeries;
const prefix = '-';

client.on('ready', () => {
	mainChannel = client.guilds.cache.get(mainServerID).channels.resolve(mainChannelID);
	client.user.setAvatar(Avatar);
	text = fs.readFileSync('anime.json',{encoding:'utf8'});
	onGoingSeries = JSON.parse(text);
});

client.on('message', msg => {
    msg.content = msg.content.toLowerCase();
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if(command == "start")
	{
		let series = SearchJSONForKeyWord(onGoingSeries, args);
		if(series == null) 
		{
			msg.reply("seria nu a fost gasita");
			return;
		}
		if(!(checkPermission(msg.member, 'Administratori') || checkPermission(msg.member,'Tăticii mari')))
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
		fs.writeFileSync('anime.json', onGoingSeries);
	}
	else if(command == "update") // -update [serie] [stadiu] [optional: -not]
	{
		if(	!(checkPermission(msg.member, 'Traducător')) 	&& args[1] == "traducere"
		|| 	!(checkPermission(msg.member, 'Verificator')) 	&& args[1] == "verificare"
		||	!(checkPermission(msg.member, 'Typesetter')) 	&& args[1] == "typesetting"
		||	!(checkPermission(msg.member, 'Encoder')) 		&& args[1] == "encode"
	  	)
		{
			msg.reply("nu ai permisiunile necesare pentru a folosi comanda");
			return;
		}
		let series = SearchJSONForKeyWord(onGoingSeries, args);

		if(series == null) 
		{
			msg.reply("seria nu a fost gasita");
			return;
		}
	
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
		showProgres(msg, args, mainChannel);
		fs.writeFileSync('anime.json', JSON.stringify(onGoingSeries));
	}
	else if(command == "progres")
	{
		showProgres(msg, args, msg.channel);
	}	
});

function checkPermission(user, roleNecessary)
{
	if(user.roles.cache.some(role => role.name === roleNecessary))
		return true;
	return false;
}

function showProgres(msg, args, chan)
{
		let series = SearchJSONForKeyWord(onGoingSeries, args);
		if(series == null) 
		{
			msg.reply("Seria nu a fost gasita");
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

		chan.send(exampleEmbed);
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
