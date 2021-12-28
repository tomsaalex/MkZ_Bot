const PermissionError = require('../exceptions/permission_error.js').PermissionError

class PermissionValidator{
	static ValidateUserPermissions(user, permission_level){
		var hasPermission = true
		
		let adminPermissionRoles = ['Administrator', 'Tăticii mari', 'Tăticul mic']


		if (permission_level == "administrator")
		{
			console.log("Got in.");
			console.log(this.CheckRole(user, 'Administrator'));
			for (let _role of adminPermissionRoles)
				if (this.CheckRole(user, _role) == true)
					return true;
				else
				console.log(user + " " + _role);

			throw new PermissionError("Permisiuni insuficiente!");
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