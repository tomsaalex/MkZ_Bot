const PermissionValidator = require('../validators/permission_validator.js').PermissionValidator
const PermissionError = require('../exceptions/permission_error.js').PermissionError

class ServiceProject{
	constructor(repo_project)
	{
		this.repo_project = repo_project;
	}

	StartCommand(msg, args){
		//if(!PermissionValidator.ValidateUserPermissions(msg.member, "administrator"))
		//	throw new PermissionError("InsufficientPermissions")
		console.log(this.repo_project.GetAll())
	}
}

module.exports = {
	ServiceProject
}