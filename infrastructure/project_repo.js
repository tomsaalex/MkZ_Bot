const fs = require('fs');
const mysql = require('mysql');
const { ProjectType } = require('../domain/entity_project_type');
const RepositoryError = require('../exceptions/repository_error').RepositoryError
const Project = require('../domain/entity_project').Project

class RepoProjects{
	#projects;
	#con;
	constructor(host, user, password, database)
	{
		this.#projects = [];
		this.ReadAllFromFile();
		console.log(this.#projects);
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
		console.log(this.#projects);

		for(let _proj of this.#projects)
			if(_proj.title == project.title)
				throw new RepositoryError("exista deja o serie cu acelasi titlu.");
		
		this.#projects.push(project);

		this.AppendToFile();
	}

	GetAll()
	{
		this.ReadAllFromFile()
		return this.#projects;
	}

	ReadAllFromFile()
	{
		let text = fs.readFileSync("anime2.json",{encoding:'utf8'});
		if(text.length < 1)
			return;

		let tempProjects = JSON.parse(text);
		let p;

		for (let proj of tempProjects) {
			let id =  proj["_id"];
			let title = proj["_title"];
			let keyWords = proj["_keyWords"];
			let cover =  proj["_cover"];
			let episodesNum = proj["_episodesNum"];
			let typeObject = proj["_type"];
			let type = new ProjectType(typeObject.type);
			p = new Project(id, title, keyWords, cover, episodesNum, type);
			this.#projects.push(p);
		}
	}

	AppendToFile()
	{
		fs.writeFileSync("anime2.json", JSON.stringify(this.#projects, null, 4));
	}

	GetProjectByKeyWord(keyWord)
	{console.log(this.#projects);
		for(var i = 0; i < this.#projects.length; i++)
		{
			let _proj = this.#projects[i];
			for(var j = 0; j < _proj.keyWords.length; j ++)
				if (keyWord == _proj.keyWords[j])
					return _proj;
		}

		throw new RepositoryError("Proiect inexistent!");
			
	}

}

module.exports = {
	RepoProjects
}