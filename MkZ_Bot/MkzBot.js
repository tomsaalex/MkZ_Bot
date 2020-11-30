const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const token = JSON.parse(fs.readFileSync('token.json')).token;
const Avatar = 'http://manga-kids.com/wp-content/uploads/2020/08/Hereisararerobotpepe_d7d99eaf4edf4b0adae514bcc94ce151.png';


const mainServerID = "313373031022198786";
const mainChannelID = "745231871905890374";


//ID-ul serverului si al canalului pentru actualizari
/*const mainServerID = "595184419950559233";
const mainChannelID = "595184420382834688";*/

var mainChannel;

client.login(token);

var text, onGoingSeries;
const prefix = '--';

client.on('ready', () => {
	mainChannel = client.guilds.cache.get(mainServerID).channels.resolve(mainChannelID);
	//client.user.setAvatar(Avatar);
	refreshJSON();
});

client.on('message', msg => {
    if(!(msg.content.includes("add") || msg.content.includes("edit")))
    	msg.content = msg.content.toLowerCase();
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if(command == "start")
	{
		let series = SearchJSONForKeyWord(onGoingSeries, args);
		if(series == null) 
		{
			msg.reply(" seria nu a fost gasita");
			return;
		}
		if(!(checkPermission(msg.member, 'Administratori') || checkPermission(msg.member,'Tăticii mari')))
		{
			msg.reply(" nu ai permisiunile necesare pentru a folosi comanda");
			return;
		}
		if(args[1] == null)
		{
			msg.reply(" trebuie să specifici un episod");
			return;
		}
		series.traducere = 0;
		series.verificare = 0;
		series.typesetting = 0;
		series.encode = 0;
		series.episod = args[1];
		fs.writeFileSync('anime.json', onGoingSeries);
	}
	else if(command == "refresh")
	{
	    if(!(checkPermission(msg.member, 'Administrator🌟') || checkPermission(msg.member,'Tăticii mari')))
		{
			msg.reply(" nu ai permisiunile necesare pentru a folosi comanda");
			return;
		}
		
	    refreshJSON();
	}
	else if(command == "update") // -update [serie] [stadiu] [optional: -not]
	{
		if(	!(checkPermission(msg.member, 'Traducător')) 	&& args[1] == "traducere"
		|| 	!(checkPermission(msg.member, 'Verificator')) 	&& args[1] == "verificare"
		||	!(checkPermission(msg.member, 'Typesetter')) 	&& args[1] == "typesetting"
		||	!(checkPermission(msg.member, 'Encoder')) 		&& args[1] == "encode"
	  	)
		{
			msg.reply(" nu ai permisiunile necesare pentru a folosi comanda");
			return;
		}

		if(args[1] == null)
			{
				msg.reply(" nu ai specificat un rol");
				return;
			}
		if(args[1] != "traducere"
		&& args[1] != "verificare"
		&& args[1] != "typesetting"
		&& args[1] != "encode")
			{
				msg.reply(" rolul specificat nu a fost găsit");
				return;
			}
		let series = SearchJSONForKeyWord(onGoingSeries, args[0]);// args[0] in loc de args NETESTAT

		if(series == null) 
		{
			msg.reply(" seria nu a fost gasită");
			return;
		}
	
		let valoareViitoare = 1;

		if(args[2] == "-not")
			valoareViitoare = 0;
		else if(args[2] != null) //NETESTAT
			msg.reply(" argumentul \„" + args[2] + "\” nu este recunoscut");
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
	else if(command == "add")
	{
		if(	!(checkPermission(msg.member, 'Tăticii mari') || checkPermission(msg.member, 'Administrator🌟')))
		{
			msg.reply(" nu ai permisiunile necesare pentru a folosi comanda");
			return;
		}
		let anime = new Anime();
		let keyWords = new Array();
		let i = 2;
		while(args[i] != null)
		{
			keyWords.push(args[i++]);
		}

		anime.title = args[0];
		anime.image = args[1];
		anime.episod = "01";
		anime.keyWords = keyWords;
		anime.traducere = 0;
		anime.verificare = 0;
		anime.encoding = 0;
		anime.typesetting = 0;
		onGoingSeries.push(anime);
		fs.writeFileSync('anime.json', JSON.stringify(onGoingSeries));
		refreshJSON();
		
		msg.reply(" seria " + anime.title + " a fost adăugată");
	}	
	else if(command == "drop")
	{
		
		if(	!(checkPermission(msg.member, 'Tăticii mari') || checkPermission(msg.member, 'Administrator🌟')))
		{
			msg.reply(" nu ai permisiunile necesare pentru a folosi comanda");
			return;
		}

		let series = SearchJSONForKeyWord(onGoingSeries, args[0]);
		if(series == null)
		{
			msg.reply(" seria " + args[0] + " nu a fost găsită");
			return;
		}
		for(let i = 0; i < onGoingSeries.length; i++)
			if(onGoingSeries[i].title === series.title)
				{
					delete onGoingSeries[i];
					for(let j = i; j < onGoingSeries.length - 1; j++)
						onGoingSeries[j] = onGoingSeries[j + 1];
					onGoingSeries.splice(-1, 1);
					break;
				}

		fs.writeFileSync('anime.json', JSON.stringify(onGoingSeries));
		refreshJSON();
		msg.reply(" seria " + series.title + " a fost înlăturată");
		
	}
	else if(command == "edit")
	{
		if(	!(checkPermission(msg.member, 'Tăticii mari') || checkPermission(msg.member, 'Administrator🌟')))
		{
			msg.reply(" nu ai permisiunile necesare pentru a folosi comanda");
			return;
		}

		let series = SearchJSONForKeyWord(onGoingSeries, args[0]);
		let propertyToChange = args[1];
		let newPropertyValue;
		if(propertyToChange === "title")
			newPropertyValue = replaceTextInString(args[2]);
		else
			newPropertyValue = args[2];

		series[propertyToChange] = newPropertyValue;
				
		fs.writeFileSync('anime.json', JSON.stringify(onGoingSeries));
		refreshJSON();

		msg.reply("seria " + series.title + " a fost editată");			
	}
	else if(command == "help")
	{
		const helpEmbed = new Discord.MessageEmbed()
		.setColor([0, 0, 255])
		.setTitle("Comenzile disponibile")
		.addFields(
			
				{name: "Comenzile disponibile utilizatorilor", value: "-progres [nume serie] (Afișează starea episodului curent din seria dată)"},
				{name: "Comenzile disponibile membrilor echipei", value: "-update [nume serie] [etapa procesului de traducere] [(opțional) \"-not\"] (actualizează starea procesului de traducere)"},
				{name: "Comenzile disponibile administratorilor", value: "-start [nume serie] [număr / nume episod] (începe traducerea unui episod)\n-add [nume serie] [URL pentru thumbnail-ul seriei] [lista de cuvinte cheie a seriei] (adaugă o serie nouă pe baza parametrilor)\n-drop [nume serie] (înlatură o serie din lista bot-ului)\n-edit [nume serie] [proprietatea care trebuie editată] [noua valoare a proprietății] (editează una dintre proprietățile unei serii)"}
		)
		.setTimestamp();

		msg.channel.send(helpEmbed);
	}
});

function refreshJSON()
{
	text = fs.readFileSync('anime.json',{encoding:'utf8'});
	onGoingSeries = JSON.parse(text);
}

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
			msg.reply(" seria nu a fost gasita");
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
					return obj[i];
				}
		}
	}

	return null;
}

function replaceTextInString(str)
{
	for(let i = 0; i < str.length - 2; i++)
	{
		arr = Array.from(str);
		if(arr[i] === arr[i + 1] && arr[i + 1] === arr[i + 2] && arr[i + 2] === "-")
		{
			arr[i] = " ";
			for(let j = i + 3; j < str.length; j++)
				arr[j - 2] = arr[j];
			str = arr.join("");
			str = str.substr(0, str.length - 2);
		}
	}
	return str;
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
