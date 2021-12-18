const PermissionError = require('../exceptions/permission_error.js').PermissionError

class PermissionValidator{
	static ValidateUserPermissions(user, permission_level){
		var hasPermission = true
		
		let adminPermissionRoles = ['Administrator', 'Tăticii mari', 'Tăticul mic']


		if (permission_level == "administrator")
		{
			console.log("Got in.")
			for (let _role in adminPermissionRoles)
				if (this.CheckRole(user, _role) == true)
					return true;

			throw PermissionError("Permisiuni insuficiente!");
		}
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