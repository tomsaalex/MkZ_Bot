const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs'); 

client.login('NTAyMTczMjUxNTk4OTQyMjA5.W8dzSQ.nD7IhGcslAXGUr36vXqHnSCJBB0');

//let inazuma;

var text, onGoingSeries;
const prefix = _;

client.on('ready', () => {
	//inazuma = new Anime("inaz", ["orion", "kokuin"]);
	text = fs.readFileSync('test.json',{encoding:'utf8'});
	onGoingSeries = JSON.parse(text);
	console.log(SearchJSONForKeyWord(onGoingSeries, "orion"));

});

client.on('message', msg => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if(args.length == 0)
	{
		
	}
});


function SearchJSONForKeyWord(obj, keyword)
{
	keyword.toLowerCase();
	
	for(var i = 0; i < obj.length; i++)
	{
		for(var j = 0; j < obj[i].keyWords.length; j++)
		{
			if(keyword === obj[i].keyWords[j])
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