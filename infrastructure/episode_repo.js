const fs = require('fs');
const mysql = require('mysql')
const RepositoryError = require('../exceptions/repository_error').RepositoryError

class RepoProjects{
	#projects;
	#con;
	constructor(host, user, password, database)
	{
		this.#episodes = [];

		this.#con = mysql.createConnection({
			host: host,
			user: user,
			password: password,
			database: database
		});
		  
		this.#con.connect(function(err) {
			if (err) throw err;
			console.log("Connected!");
			/*var sql = "INSERT INTO episodes (title_id) VALUES ('1')";
			con.query(sql, function (err, result) {
			  if (err) throw err;
			  console.log("1 record inserted");
			});*/	
		});
	}

	Connect()
	{
		
		this.con.connect(function(err) {
			if (err) throw err;
			console.log("Connected!");
			
		});
	}

	GetNextID()
	{
		let maxID = 0;
		for(let _proj of this.#projects)
			if(_proj.id > maxID)
				maxID = _proj.id;
		
		return (maxID + 1);
	}

	AddProject(project)
	{
		for(let _proj of this.#projects)
			if(_proj.title == project.title)
				throw RepositoryError("exista deja o serie cu acelasi titlu.");
		
		this.#projects.push(project);
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

	GetProjectByKeyWord(keyWord)
	{
		for(var i = 0; i < this.projects.length; i++)
		{
			let _proj = this.projects[i];
			for(var j = 0; j < _proj.keyWords.length; j ++)
				if (keyWord == _proj.keyWords[j])
					return _proj;
		}

		throw RepositoryError("Proiect inexistent!")
			
	}

}

module.exports = {
	RepoProjects
}