const fs = require('fs');
const mariadb = require('mariadb')
const RepositoryError = require('../exceptions/repository_error').RepositoryError

class DBRepoEpisodes{
	#con;
	constructor(host, user, password, database)
	{

		this.#con = mariadb.createPool({
			host: host,
			user: user,
			password: password,
			database: database
		});
	}

	AddEpisode(episode)
	{
		console.log("Adding project to DB.");
	}

	GetAll()
	{
		console.log("Getting all projects from DB.");
	}


	GetEpisode(projectID, episodeNum)
	{
		console.log("Retrieves episode from DB.");
	}

}

module.exports = {
	RepoEpisodes: DBRepoEpisodes
}