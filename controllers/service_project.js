const PermissionValidator = require('../validators/permission_validator.js').PermissionValidator
const PermissionError = require('../exceptions/permission_error.js').PermissionError

class ServiceProject{
	constructor(repo_project)
	{
		this.repo_project = repo_project;
	}

	StartCommand(msg, args){
		//start: --start [keyWord serie] [număr / nume episod] (începe traducerea unui episod)
		PermissionValidator.ValidateUserPermissions(msg.member, "administrator");
		
		if (args[2] == null)
			throw Error("")

		let project = this.repo_project.GetProjectByKeyWord(args[0]);


		
	}
}

module.exports = {
	ServiceProject
}