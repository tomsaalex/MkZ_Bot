const { PermissionError } = require("../exceptions/permission_error");
const { RepositoryError } = require("../exceptions/repository_error");
const { ProjectTypeError } = require("../exceptions/project_type_error");
const { MissingArgumentError } = require("../exceptions/missing_argument_error");
const { MessageFlags } = require("discord.js");
const { SqlError } = require("mariadb");

class UI {
	constructor(projectController, client) {
		this.projectController = projectController
		this.client = client;
	}

	IsValidCommand(msg, prefix) {
		if (msg.content.startsWith(prefix) == false || msg.author.bot == true)
			return false;

		return true;
	}

	async ProcessCommand(msg, prefix) {
		const args = msg.content.slice(prefix.length).trim().split(' ');
		const command = args.shift().toLowerCase();

		if (command == "start") {
			try {
				this.projectController.StartCommand(msg, args);
				msg.react('✅');
			} catch (error) {
				if (error instanceof PermissionError)
					msg.reply("nu ai permisiunile necesare pentru aceata comanda.");
				else if (error instanceof RepositoryError)
					msg.reply("seria nu exista.");
				else if (error.message)
					msg.reply(error.message);
				msg.react('❌'); return;
			}
		}
		else if (command == "update") {
			/*try
			{
				this.projectController.UpdateCommand(msg, args);
				msg.react('✅');
			} catch(error)
			{
				if (error instanceof PermissionError)
					msg.reply("nu ai permisiunile necesare pentru aceasta comanda.");
				else if (error instanceof RepositoryError)
				{
					if(error.message.includes("Episod"))
						msg.reply("episodul nu exista.");
					else if(error.message.includes("Proiect"))
						msg.reply("seria nu exista.");			
				}
				else if (error instanceof MissingArgumentError) {
					msg.reply("urmatoarele argumente lipsesc din comanda:\n" + error.message);
				}
				else if (error.message)
					msg.reply(error.message);
				msg.react('❌'); return;
			}*/
			;
		}
		else if (command == "progres") {
			//Progres command
			msg.reply("Comanda este progres");
		}
		else if (command == "add") {
			try {
				let title = await this.projectController.AddCommand(msg, args);
				msg.reply("seria " + title + " a fost adaugata cu succes!");
				msg.react('✅');
			} catch (error) {
				if (error instanceof PermissionError) {
					msg.reply("nu ai permisiunile necesare pentru aceata comanda.");
				}
				else if (error instanceof ProjectTypeError) {
					msg.reply("tipul de proiect este invalid.")
				}
				else if (error instanceof MissingArgumentError) {
					msg.reply("urmatoarele argumente lipsesc din comanda:\n" + error.message);
				}
				else if (error.message){
					msg.reply(error.message);
				}
				msg.react('❌'); return;
			}
		}
		else if (command == "drop") {
			try {
				let title_keyword = await this.projectController.DropCommand(msg, args);
				msg.reply("seria " + title_keyword[1] + " cu cuvantul cheie " + title_keyword[0] + " a fost inlaturata cu succes!");
				msg.react('✅');
			}
			catch(error)
			{
				if (error instanceof PermissionError) {
					msg.reply("nu ai permisiunile necesare pentru aceata comanda.");
				}
				else if (error instanceof MissingArgumentError) {
					msg.reply("urmatoarele argumente lipsesc din comanda:\n" + error.message);
				}
				else if (error.message){
					msg.reply(error.message);
				}
				msg.react('❌'); return;
			}
		}
		else if (command == "edit") {
			try {
				let title = await this.projectController.EditCommand(msg, args);
				msg.reply("valoarea " + args[1] + " a seriei " + title + " a fost modificata in " + args[2]);
				msg.react('✅');
			}
			catch(error)
			{
				if (error instanceof PermissionError) {
					msg.reply("nu ai permisiunile necesare pentru aceata comanda.");
				}
				else if (error instanceof MissingArgumentError) {
					msg.reply("urmatoarele argumente lipsesc din comanda:\n" + error.message);
				}
				else if (error.message){
					msg.reply(error.message);
				}
				msg.react('❌'); return;
			}
		}
		else if (command == "help") {
			//Help command
			msg.reply("Comanda este help");
		}
		else if (command == "setqc") {
			//Setqc command
			msg.reply("Comanda este setqc");
		}
		else if (command == "settiming") {
			//Settiming
			msg.reply("Comanda este settiming");
		}
	}
}



module.exports = {
	UI
}