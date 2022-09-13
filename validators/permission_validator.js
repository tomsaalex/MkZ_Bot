const { JobManager } = require('./job_validator.js')

const PermissionError = require('../exceptions/permission_error.js').PermissionError

class PermissionValidator{

	static adminPermissionRoles = ['Administrator', 'Tăticii mari', 'Tăticul mic']
	static traducatorPermissionRoles = ['Traducător']
	static verificatorPermissionRoles = ['Verificator']
	static encoderPermissionRoles = ['Encoder']
	static typesetterPermissionRoles = ['Typesetter']
	static qcPermissionRoles = ['Quality Checker']
	static timerPermissionRoles = ['Timer']


	static ValidateUserPermissions(user, permission_level){
		var hasPermission = true
		
		let permissionsToCheck;

		//TODO
		//Change this to use a dictionary.
		if (permission_level == JobManager.Administrator)
		{
			permissionsToCheck = PermissionValidator.adminPermissionRoles;
		}
		else if(permission_level == JobManager.Traducator)
		{
			permissionsToCheck = PermissionValidator.traducatorPermissionRoles;
		}
		else if(permission_level == JobManager.Verificator)
		{
			permissionsToCheck = PermissionValidator.verificatorPermissionRoles;
		}
		else if(permission_level == JobManager.Encoder)
		{
			permissionsToCheck = PermissionValidator.encoderPermissionRoles;
		}
		else if(permission_level == JobManager.Typesetter)
		{
			permissionsToCheck = PermissionValidator.typesetterPermissionRoles;
		}
		else if(permission_level == JobManager.QualityChecker)
		{
			permissionsToCheck = PermissionValidator.qcPermissionRoles;
		}
		else if(permission_level == JobManager.Timer)
		{
			permissionsToCheck = PermissionValidator.timerPermissionRoles;
		}
		

		for (let _role of permissionsToCheck)
				if (this.CheckRole(user, _role) == true)
					return true;
				
		throw new PermissionError("Permisiuni insuficiente!");
	}

	static CheckRole(user, roleNecessary){
		if(user.roles.cache.some(role => role.name === roleNecessary))
			return true;
		return false;
	}
}

module.exports = {
	PermissionValidator
}