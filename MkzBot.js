const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const { token } = require("./token.json");

//ID-uri Cenaclu
const cenacluServerID = "313373031022198786";
const cenacluChannelID = "745231871905890374";

//ID-uri Sinod
const sinodServerID = "595184419950559233";
const sinodChannelID = "595184420382834688";

var mainChannel, sinodChannel;

client.login(token);

var text, onGoingSeries;
const prefix = '--';

client.on('ready', () => {
	mainChannel = client.guilds.cache.get(cenacluServerID).channels.resolve(cenacluChannelID);
	sinodChannelID = client.guilds.cache.get(sinodServerID).channels.resolve(sinodChannelID);

	refreshJSON();

	//This only really needs to run once to update the json with the series type, but shhhh
	//It classifies existing projects as manga and anime. It's useful for those that have been created before the manga update
	for(let project of onGoingSeries)
	{
		if(project.type == null)
		{
			if(project.encode != null)
				project.type = "anime";
			else if(project.editare != null)
				project.type = "manga";
		}
	}

	fs.writeFileSync('anime.json', JSON.stringify(onGoingSeries, null, 4));
	sinodChannel.send("Ad astra abyssoque. Welcome to the MkZ Family.");
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
			msg.react('❌'); return; 
		}
		if(!(checkPermission(msg.member, 'Administratori') || checkPermission(msg.member,'Tăticii mari') || checkPermission(msg.member,'Tăticul mic')))
		{
			msg.reply(" nu ai permisiunile necesare pentru a folosi comanda");
			msg.react('❌'); return; 
		}
		if(args[1] == null)
		{
			msg.reply(" trebuie să specifici un episod");
			msg.react('❌'); return; 
		}
		series.traducere = 0;
		series.verificare = 0;
		series.typesetting = 0;
		series.encode = 0;
		series.editare = 0;
		series.qc = 0;
		series.episod = args[1];
		fs.writeFileSync('anime.json', JSON.stringify(onGoingSeries, null, 4));
	}
	else if(command == "refresh")
	{
	    if(!(checkPermission(msg.member, 'Administrator🌟') || checkPermission(msg.member,'Tăticii mari')  || checkPermission(msg.member,'Tăticul mic')))
		{
			msg.reply(" nu ai permisiunile necesare pentru a folosi comanda");
			msg.react('❌'); return; 
		}
		
	    refreshJSON();
	}
	else if(command == "update") // -update [serie] [stadiu] [optional: -not]
	{
		
		let embedColor = [150, 0, 255];
		if(	!(checkPermission(msg.member, 'Traducător')) 		&& args[1] == "traducere"
		|| 	!(checkPermission(msg.member, 'Verificator')) 		&& args[1] == "verificare"
		||	!(checkPermission(msg.member, 'Typesetter')) 		&& args[1] == "typesetting"
		||	!(checkPermission(msg.member, 'Encoder')) 			&& args[1] == "encode"
		||  !(checkPermission(msg.member, 'Editor'))        	&& args[1] == "editare"  
		||  !(checkPermission(msg.member, 'Timer'))        		&& args[1] == "timing"  
		||  !(checkPermission(msg.member, 'Quality Checker')) 	&& args[1] == "qc"    
	  	)
		{
			msg.reply(" nu ai permisiunile necesare pentru a folosi comanda");
			msg.react('❌'); return; 
		}

		if(args[1] == null)
			{
				msg.reply(" nu ai specificat un rol");
				msg.react('❌'); return; 
			}
		if(args[1] != "traducere"
		&& args[1] != "verificare"
		&& args[1] != "typesetting"
		&& args[1] != "encode"
		&& args[1] != "editare"
		&& args[1] != "timing"
		&& args[1] != "qc")
			{
				msg.reply(" rolul specificat nu a fost găsit");
				msg.react('❌'); return; 
			}
		let series = SearchJSONForKeyWord(onGoingSeries, args[0]);

		if(series == null) 
		{
			msg.reply(" seria nu a fost gasită");
			msg.react('❌'); return; 
		}
	
		let valoareViitoare = 1;

		if(args[2] == "-not")
			{
				valoareViitoare = 0;
				embedColor = [255, 0, 0];
			}
		else if(args[2] != null) 
			msg.reply(" argumentul \„" + args[2] + "\” nu este recunoscut");
		
		if(series.type == "anime")
			switch(args[1])
			{
				case 'traducere': series.traducere = valoareViitoare; break;
				case 'verificare': series.verificare = valoareViitoare; break;
				case 'typesetting': series.typesetting = valoareViitoare; break;
				case 'encode': series.encode = valoareViitoare; break;
				case 'qc': if(series.qcEnabled) {series.qc = valoareViitoare; break;}
				case 'timing': if(series.timingEnabled) {series.timing = valoareViitoare; break;}
				default: msg.reply("nu prea merge la seria asta, boss..."); msg.react('❌'); return;
			}
		else if(series.type == "manga")
		{
			switch(args[1])
			{

				case 'traducere': series.traducere = valoareViitoare; break;
				case 'verificare': series.verificare = valoareViitoare; break;
				case 'editare': series.editare = valoareViitoare; break;
				case 'qc': if(series.qcEnabled) {series.qc = valoareViitoare; break;}
				default: msg.reply("nu prea merge la seria asta, boss..."); msg.react('❌'); return;
			}
		}
		else if(series.type == "bd")
		{
			switch(args[1])
			{
				case 'timing': series.timing = valoareViitoare; break;
				case 'typesetting': series.typesetting = valoareViitoare; break;
				case 'encode': series.encode = valoareViitoare; break;
				case 'qc': series.qc = valoareViitoare; break;
				default: msg.reply("nu prea merge la seria asta, boss..."); msg.react('❌'); return;
			}
		}
		series.lastUpdate = new Date();
		showProgres(msg, args, mainChannel, embedColor);
		fs.writeFileSync('anime.json', JSON.stringify(onGoingSeries, null, 4));
	}
	else if(command == "progres")
	{
		let embedColor = [150, 0, 255];
		showProgres(msg, args, msg.channel, embedColor);
		return;	
	}
	else if(command == "add")
	{
		args[0] = args[0].toLowerCase();
		if(	!(checkPermission(msg.member, 'Tăticii mari') || checkPermission(msg.member, 'Administrator🌟') || checkPermission(msg.member,'Tăticul mic')))
		{
			msg.reply(" nu ai permisiunile necesare pentru a folosi comanda");
			msg.react('❌'); return; 
		}
		if(args[0] != "anime" && args[0] != "manga" && args[0] != "bd")
		{
			msg.reply(" trebuie să specifici dacă seria e anime, manga sau BD");
			return;
		}
		if(args[1] == null)
		{
			msg.reply(" trebuie să specifici un titlu pentru serie");
			msg.react('❌'); return; 
		}
		if(args[2] == null)
		{
			msg.reply(" trebuie să specifici un link pentru thumbnail-ul seriei");
			msg.react('❌'); return; 
		}
		if(args[3] == null)
		{
			msg.reply(" trebuie să specifici măcar un cuvânt cheie cu care să poată fi identificată seria");
			msg.react('❌'); return; 
		}

		args[1] = args[1].replace(/---/g, " ");

		for(let project of onGoingSeries)
		{
			if(project.title == args[1])
				{
					msg.reply(" seria " + args[1] + " este deja adăugată");
					msg.react('❌'); return; 
				}
		}
		
		let keyWords = new Array();
		let i = 2;
		while(args[i] != null)
		{
			keyWords.push(args[i++].toLowerCase());
		}

		let series;
		if(args[0] == "anime")
		{	
			series = new Anime();
		}
		else if(args[0] == "manga")
		{
			series = new Manga();
		}
		else if(args[0] == "bd")
		{
			args[1] += " (BD)";
			series = new BD();
		}
		series.type = args[0];
		series.title = args[1];
		series.image = args[2];
		series.episod = "01";
		series.keyWords = keyWords;
		series.lastUpdate = new Date();
		
		if(series.type == "anime")
		{
			series.traducere = 0;
			series.verificare = 0;
			series.encode = 0;
			series.typesetting = 0;
		}
		else if(series.type == "manga")
		{
			series.traducere = 0;
			series.verificare = 0;
			series.editare = 0;
		}
		else if(series.type == "bd")
		{
			series.timing = 0;
			series.typesetting = 0;
			series.encode = 0;
			series.qc = 0;
		}
		onGoingSeries.push(series);
		fs.writeFileSync('anime.json', JSON.stringify(onGoingSeries, null, 4));
		refreshJSON();
		
		msg.reply(" seria " + series.title + " a fost adăugată");
	}	
	else if(command == "drop")
	{
		if(	!(checkPermission(msg.member, 'Tăticii mari') || checkPermission(msg.member, 'Administrator🌟') || checkPermission(msg.member,'Tăticul mic')))
		{
			msg.reply(" nu ai permisiunile necesare pentru a folosi comanda");
			msg.react('❌'); return; 
		}
		if(args[0] == null)
		{
			msg.reply(" nu ai precizat o serie care să fie înlăturată");
			msg.react('❌'); return; 
		}

		let series = SearchJSONForKeyWord(onGoingSeries, args[0]);
		if(series == null)
		{
			msg.reply(" seria " + args[0] + " nu a fost găsită");
			msg.react('❌'); return; 
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

		fs.writeFileSync('anime.json', JSON.stringify(onGoingSeries, null, 4));
		refreshJSON();
		msg.reply(" seria " + series.title + " a fost înlăturată");
		
	}
	else if(command == "edit")
	{
		if(	!(checkPermission(msg.member, 'Tăticii mari') || checkPermission(msg.member, 'Administrator🌟') || checkPermission(msg.member,'Tăticul mic')))
		{
			msg.reply(" nu ai permisiunile necesare pentru a folosi comanda");
			msg.react('❌'); return; 
		}
		if(args[0] == null)
		{
			msg.reply(" nu ai specificat o serie");
			msg.react('❌'); return; 
		}

		args[0] = args[0].toLowerCase();

		let series = SearchJSONForKeyWord(onGoingSeries, args[0]);
		if(series == null)
		{
			msg.reply(" seria " + args[0] + " nu a fost găsită");
			msg.react('❌'); return; 
		}
		if(args[1] == null)
		{
			msg.reply(" nu ai specificat ce trebuie editat la seria " + args[0]);
			msg.react('❌'); return; 
		}
		if(series[args[1]] == null)
		{
			msg.reply(" proprietatea pe care încerci să o editezi nu există sau nu poate fi editată momentan");
			msg.react('❌'); return; 
		}
		if(args[2] == null){
			msg.reply(' nu ai specificat cu ce trebuie înlocuită valoarea proprietății "' + args[1] +  '"');
			msg.react('❌'); return; 
		}
		args[2] = args[2].replace(/---/g, " ");

		let propertyToChange = args[1];
		let newPropertyValue;
		newPropertyValue = args[2];

		series[propertyToChange] = newPropertyValue;
				
		fs.writeFileSync('anime.json', JSON.stringify(onGoingSeries, null, 4));
		refreshJSON();

		msg.reply("seria " + series.title + " a fost editată");			
	}
	else if(command == "help")
	{
		const helpEmbed = new Discord.MessageEmbed()
		.setColor([0, 0, 255])
		.setTitle("Comenzile disponibile")
		.addFields(
			
				{name: "Comenzile disponibile utilizatorilor", value: prefix + "progres [nume serie] (Afișează starea episodului curent din seria dată)"},
				{name: "Comenzile disponibile membrilor echipei", value: prefix + "update [nume serie] [etapa procesului de traducere] [(opțional) \"-not\"] (actualizează starea procesului de traducere)"},
				{name: "Comenzile disponibile administratorilor", value: prefix + "start [nume serie] [număr / nume episod] (începe traducerea unui episod)\n" + prefix + "add [tip serie: anime/manga/BD][nume serie] [URL pentru thumbnail-ul seriei] [lista de cuvinte cheie a seriei] (adaugă o serie nouă pe baza parametrilor)\n" + prefix +"drop [nume serie] (înlatură o serie din lista bot-ului)\n" + prefix + "edit [nume serie] [proprietatea care trebuie editată] [noua valoare a proprietății] (editează una dintre proprietățile unei serii)\n" + prefix + "setqc [nume serie] [true/false] (activeaza/dezactiveaza Quality Check-ul pentru seria respectiva)\n"}
		)
		.setTimestamp();

		msg.channel.send(helpEmbed);
	} 
	else if(command == "setqc")
	{
		if(	!(checkPermission(msg.member, 'Tăticii mari') || checkPermission(msg.member, 'Administrator🌟') || checkPermission(msg.member,'Tăticul mic')))
		{
			msg.reply("nu ai permisiunile necesare pentru a folosi comanda");
			msg.react('❌'); return; 
		}

		let series = SearchJSONForKeyWord(onGoingSeries, args[0]);


		if(series == null) 
		{
			msg.reply("seria nu a fost gasită");
			msg.react('❌'); return; 
		}

		if(series.type == "bd")
		{
			msg.reply("nu prea merge la seria asta, boss..."); 
			msg.react('❌'); return;
		}

		if(args[1] != "true" && args[1] != "false")
		{
			msg.reply("Al doilea argument trebuie sa fie true/false");
			msg.react('❌'); return;	
		}
		
		if(args[1] == "true")
			series.qcEnabled = true;
		else if(args[1] == "false")
			{
				series.qc = 0;
				series.qcEnabled = false;
			}
		
	}
	else if(command == "settiming")
	{
		if(	!(checkPermission(msg.member, 'Tăticii mari') || checkPermission(msg.member, 'Administrator🌟') || checkPermission(msg.member,'Tăticul mic')))
		{
			msg.reply("nu ai permisiunile necesare pentru a folosi comanda");
			msg.react('❌'); return; 
		}

		let series = SearchJSONForKeyWord(onGoingSeries, args[0]);


		if(series == null) 
		{
			msg.reply("seria nu a fost gasită");
			msg.react('❌'); return; 
		}
		
		if(series.type == "bd" || series.type == "manga")
		{
			msg.reply("nu prea merge la seria asta, boss..."); 
			msg.react('❌'); return;
		}


		if(args[1] != "true" && args[1] != "false")
		{
			msg.reply("Al doilea argument trebuie sa fie true/false");
			msg.react('❌'); return;	
		}
		
		if(args[1] == "true")
			series.timingEnabled = true;
		else if(args[1] == "false")
			{
				series.timing = 0;
				series.timingEnabled = false;
			}
		
	}
	else return;
	
	msg.react('✅');
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

function showProgres(msg, args, chan, color)
{
		let series = SearchJSONForKeyWord(onGoingSeries, args);
		if(series == null) 
		{
			msg.reply(" seria nu a fost gasita");
			msg.react('❌'); return; 
		}
		
		const exampleEmbed = new Discord.MessageEmbed()
		.setColor(color)
		.setTitle(series.title + ' #' + series.episod)
		.setThumbnail(series.image)
		.setTimestamp(series.lastUpdate);

		let qcField = "";
		let timingField = "";
		if(series.qcEnabled)
			qcField = "\n" + boolToStrikeThrough(series.qc, "Quality Check");
		
		if(series.timingEnabled)
			timingField = "\n" + boolToStrikeThrough(series.timing, "Timing");
		if(series.type == "anime")
		{
			exampleEmbed.addFields(
				{ 
					name: 'Progres', value: boolToStrikeThrough(series.traducere, "Traducere") + ' \n' + boolToStrikeThrough(series.verificare, "Verificare") + ' \n' + boolToStrikeThrough(series.typesetting, "Typesetting") + ' \n' + boolToStrikeThrough(series.encode, "Encode") + timingField + qcField
				});
		}
		else if(series.type == "manga")
		{
			exampleEmbed.addFields(
				{ 
					name: 'Progres', value: boolToStrikeThrough(series.traducere, "Traducere") + ' \n' + boolToStrikeThrough(series.verificare, "Verificare") + ' \n' + boolToStrikeThrough(series.editare, "Editare") + qcField
				});
		}
		else if(series.type == "bd")
		{
			exampleEmbed.addFields(
				{ 
					name: 'Progres', value: boolToStrikeThrough(series.timing, "Timing") + ' \n' + boolToStrikeThrough(series.typesetting, "Typesetting") + ' \n' + boolToStrikeThrough(series.encode, "Encode") + ' \n' + boolToStrikeThrough(series.qc, "Quality Check")
				});
		}	
		chan.send(exampleEmbed);
		msg.react('✅');
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

class Project{
	constructor(title, keyWords, image, traducere, verificare, typesetting, encode, episod, lastUpdate, type)
	{
		this.title = title;
		this.keyWords = keyWords;
		this.image = image;
		this.episod = episod;
		this.lastUpdate = lastUpdate;
		this.type = type;
	}
}

class Anime extends Project{
	constructor(traducere, verificare, typesetting, encode, qc, timing)
	{
		super();
		this.traducere = traducere;
		this.verificare = verificare;
		this.typesetting = typesetting;
		this.encode = encode;
		this.qc = qc;
		this.qcEnabled = false;
		this.timing = timing;
		this.timingEnabled = false;
	}
}

class Manga extends Project{
	constructor(traducere, verificare, editare, qc)
	{
		super();
		this.traducere = traducere;
		this.verificare = verificare;
		this.editare = editare;
		this.qc = qc;
		this.qcEnabled = false;
	}	
}

class BD extends Project{
	constructor(timing, typesetting, encode, qc)
	{
		super();
		this.timing = timing;
		this.typesetting = typesetting;
		this.encode = encode;
		this.qc = qc;
	}
}