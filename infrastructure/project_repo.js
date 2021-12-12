const fs = require('fs');

class RepoProjects{
	constructor(file_path)
	{
		this.file_path = file_path;
		this.projects = [];
	}

	GetAll()
	{
		this.ReadAllFromFile()
		return this.projects;
	}

	ReadAllFromFile()
	{
		let text = fs.readFileSync(this.file_path,{encoding:'utf8'});
		this.projects = JSON.parse(text);
	}

	AppendToFile()
	{
		fs.writeFileSync(this.file_path, JSON.stringify(onGoingSeries, null, 4));
	}

}

module.exports = {
	RepoProjects
}