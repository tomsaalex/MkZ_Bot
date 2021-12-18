const ServiceProject = require('./controllers/service_project').ServiceProject;
const RepoProjects = require('./infrastructure/project_repo').RepoProjects;
const UI = require('./presentation/ui').UI;


const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const { token } = require("./connection_data/token.json");

//ID-uri Cenaclu
const cenacluServerID = "313373031022198786";
const cenacluChannelID = "745231871905890374";

//ID-uri Sinod
const sinodServerID = "595184419950559233";
const sinodChannelID = "595184420382834688";

const testServerID = "676752976177659904";
const testChannelID = "676752976177659910";

var mainChannel, sinodChannel;

client.login(token);

var text, onGoingSeries;
const prefix = '--';

let repoProject = new RepoProjects("localhost", "root", "", "mkzbot");
let projectController = new ServiceProject(repoProject);
let ui = new UI(projectController);


client.on('ready', () => {
	mainChannel = client.guilds.cache.get(testServerID).channels.resolve(testChannelID);
	//sinodChannel = client.guilds.cache.get(sinodServerID).channels.resolve(sinodChannelID);

	//refreshJSON();


	//fs.writeFileSync('anime.json', JSON.stringify(onGoingSeries, null, 4));
	//sinodChannel.send("Ad astra abyssoque. Welcome to the MkZ Family.");
});

client.on('message', msg => {

	if (!ui.IsValidCommand(msg, prefix))
		return;

	ui.ProcessCommand(msg, prefix)
})

