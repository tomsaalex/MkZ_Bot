const ServiceProject = require('./controllers/ServiceProject').ServiceProject;
const RepoProjects = require('./infrastructure/DBProjectsRepo').RepoProjects;
const RepoEpisodes = require('./infrastructure/DBEpisodesRepo').RepoEpisodes;
const UI = require('./presentation/ui').UI;


const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });
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

let repoProject = new RepoProjects("localhost", "root", "", "mkz_bot");
let repoEpisodes = new RepoEpisodes("localhost", "root", "", "mkz_bot");
let projectController = new ServiceProject(repoProject, repoEpisodes);
let ui = new UI(projectController);

/**
 * Runs when the bot is ready to start.
 */
client.on('ready', () => {
	mainChannel = client.guilds.cache.get(testServerID).channels.resolve(testChannelID);
	//sinodChannel = client.guilds.cache.get(sinodServerID).channels.resolve(sinodChannelID);

	//refreshJSON();


	//fs.writeFileSync('anime.json', JSON.stringify(onGoingSeries, null, 4));
	//sinodChannel.send("Ad astra abyssoque. Welcome to the MkZ Family.");
});

/**
 * Runs for every message sent on the servers this instance of the bot runs on.
 */
client.on('messageCreate', msg => {
	if (!ui.IsValidCommand(msg, prefix))
		return;

	ui.ProcessCommand(msg, prefix)
})

