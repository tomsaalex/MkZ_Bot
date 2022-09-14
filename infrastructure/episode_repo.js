const fs = require('fs');
const mysql = require('mysql')
const RepositoryError = require('../exceptions/repository_error').RepositoryError

class RepoEpisodes{
	#episodes;
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
		for(let _ep of this.#episodes)
			if(_ep.id > maxID)
				maxID = _ep.id;
		
		return (maxID + 1);
	}

	AddEpisode(episode)
	{
		for(let _ep of this.#episodes)
			if(_ep.episodeNum == episode.episodeNum && _ep.projectID == episode.projectID)
				throw new RepositoryError("episodul exista deja pentru aceasta serie.");
		
		this.#episodes.push(episode);
	}

	GetAll()
	{
		return this.#episodes;
	}


	GetEpisode(projectID, episodeNum)
	{
		for(var i = 0; i < this.#episodes.length; i++)
		{
			let _ep = this.#episodes[i];
			if(_ep.showID == projectID && _ep.num == episodeNum)
				return _ep;
		}

		throw new RepositoryError("Episod inexistent.\n");
	}

}

module.exports = {
	RepoEpisodes
}