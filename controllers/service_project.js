const { PermissionValidator } = require('../validators/permission_validator').PermissionValidator;
const { PermissionError } = require('../exceptions/permission_error').PermissionError;
const { ProjectType } = require('../domain/entity_project_type').ProjectType;
const { MissingArgumentError } = require('../exceptions/missing_argument_error').MissingArgumentError;

class ServiceProject {
	constructor(repo_project) {
		this.repo_project = repo_project;
	}

	StartCommand(msg, args) {
		//start: --start [keyWord serie] [număr / nume episod] (începe traducerea unui episod)
		PermissionValidator.ValidateUserPermissions(msg.member, "administrator");

		let errorString = "";
		if (args[1] == null)
			errorString += "episod\n";

		throw MissingArgumentError(errorString);

		let project = this.repo_project.GetProjectByKeyWord(args[0]);
	}

	AddCommand(msg, args) {
		//--add [tip serie: anime/manga/BD][nume serie] [URL pentru thumbnail-ul seriei] [lista de cuvinte cheie a seriei] (adaugă o serie nouă pe baza parametrilor)
		PermissionValidator.ValidateUserPermissions(msg.member, "administrator");

		let currentType = new ProjectType(args[0])

		let errorString = "";

		if (args[1] == null)
			errorString += "titlu\n";
		if (args[2] == null)
			errorString += "cover\n";
		if (args[3] == null)
			errorString += "keyWord\n";
		if (errorString.length > 0)
			throw MissingArgumentError(errorString);

		args[1] = args[1].replace(/---/g, " ");

		//I need to move this out of here, but I'm not yet sure where
		let keyWords = new Array();
		let i = 3;
		while (args[i] != null) {
			keyWords.push(args[i++].toLowerCase());
		}

		let project = new Project(args[1], keyWords, args[2], null, currentType);

		this.repo_project.AddProject(project);

		return args[1];
	}
}

module.exports = {
	ServiceProject
}