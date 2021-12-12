class UI{
	constructor(projectController, client)
	{
		this.projectController = projectController
		this.client = client;
	}

	IsValidCommand(msg, prefix) {
		if (msg.content.startsWith(prefix) == false || msg.author.bot == true)
			return false;
		
		return true;
	}

	ProcessCommand(msg, prefix)
	{
		const args = msg.content.slice(prefix.length).trim().split(' ');
		const command = args.shift().toLowerCase();

		if(command == "start")
		{
			this.projectController.StartCommand(msg, args);
		}
		else if(command == "update")
		{
			//Update command
			msg.reply("Comanda este update");
		}
		else if(command == "progres")
		{
			//Progres command
			msg.reply("Comanda este progres");
		}
		else if(command == "add")
		{
			//Add command
			msg.reply("Comanda este add");
		}
		else if(command == "drop")
		{
			//Drop command
			msg.reply("Comanda este drop");
		}
		else if(command == "edit")
		{
			//Edit command
			msg.reply("Comanda este edit");
		}
		else if(command == "help")
		{
			//Help command
			msg.reply("Comanda este help");
		}
		else if(command == "setqc")
		{
			//Setqc command
			msg.reply("Comanda este setqc");
		}
		else if(command == "settiming")
		{
			//Settiming
			msg.reply("Comanda este settiming");
		}
	}
}



module.exports = {
	UI
}