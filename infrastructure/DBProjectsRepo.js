const fs = require('fs');
const mariadb = require('mariadb');
const { ProjectType } = require('../domain/ProjectType');
const RepositoryError = require('../exceptions/repository_error').RepositoryError
const Project = require('../domain/Project').Project

class DBRepoProjects{
	#con;
	constructor(host, user, password, database)
	{
		this.GetDatabaseConnection(host, user, password, database).then((v) => {this.#con = v});
	}

	async GetDatabaseConnection(host, user, password, database)
	{
		return await mariadb.createConnection({
			host: host,
	    	user: user,
			password: password,
			database: database
		});
	}

	/**
	 * Adds the given project to the repository.
	 * @async
	 * @param {Project} project The project to be added to the repository.
	 * @throws {RepositoryError} If a project exists in the repository that has the same title or at least one key word identical with `project`.
	 * @throws {SqlError} If an unexpected error happens due to the database.
	*/
	async AddProject(project)
	{
		const addProjectPreparedStatement = await this.#con.prepare("INSERT INTO translation_shows(title, type, episodes_num, cover) VALUES(?, ?, ?, ?)");
		
		const addKeywordsPreparedStatement = await this.#con.prepare("INSERT INTO translation_shows_keywords(show_id, key_word) VALUES(?, ?)");
		
		let foundShows = await this.#con.query("SELECT id FROM translation_shows WHERE title = ?", [project.title]);

		if(foundShows.length > 0)
		{
			throw new RepositoryError("Exista deja o serie cu titlul " + project.title);
		}
		
		let keyWordErrorMessage = "";
		for(const showKeyWordNumber in project.keyWords)
		{
			let currentKeyWord = project.keyWords[showKeyWordNumber];
			let keyWordQuery = await this.#con.query("SELECT DISTINCT show_id FROM translation_shows_keywords WHERE key_word = ?", [currentKeyWord]);
		
			if(keyWordQuery.length > 0)
			{
				keyWordErrorMessage += "Cuvantul cheie \"" + currentKeyWord + "\" este deja folosit pentru urmatoarele serii:\n";
				for(const showIDIndex in keyWordQuery)
				{
					let currentShowID = keyWordQuery[showIDIndex].show_id;
					let titleOfShowWithTheSameKeyword = await this.#con.query("SELECT title FROM translation_shows WHERE id = ?", [currentShowID]);
					keyWordErrorMessage += " - " + titleOfShowWithTheSameKeyword[0].title + "\n";
				}
			}
		}

		if(keyWordErrorMessage.length > 0)
			throw new RepositoryError(keyWordErrorMessage);

		await addProjectPreparedStatement.execute([project.title, project.projectType.typeStringValue, project.episodesNum, project.cover]);
			
		const justInsertedShow = await this.#con.query("SELECT id FROM translation_shows WHERE title = ?", [project.title]);
		let id = justInsertedShow[0].id;
			
		for(const showKeyWordNumber in project.keyWords)
		{
			let currentKeyWord = project.keyWords[showKeyWordNumber];
			await addKeywordsPreparedStatement.execute([id, currentKeyWord]);
		}
			
		await addProjectPreparedStatement.close();
	}

	async DropProject(projectKeyWord)
	{
		let keyWordDBEntryQuery = await this.#con.query('SELECT show_id FROM translation_shows_keywords WHERE key_word = ?', [projectKeyWord]);
		if(keyWordDBEntryQuery.length < 1)
		{
			throw new RepositoryError("There is no project identifiable with the key word " + projectKeyWord);
		}
		let projectToDropID = keyWordDBEntryQuery[0].show_id;
		
		let titleDBEntry = await this.#con.query('SELECT title FROM translation_shows WHERE id = ?', [projectToDropID]);

		let dropProjectPreparedStatement = await this.#con.prepare('DELETE FROM translation_shows WHERE id = ?');
		dropProjectPreparedStatement.execute([projectToDropID]);

		return titleDBEntry[0].title;
	}

	async GetAll()
	{
		const getAllProjectsPreparedStatement = (await this.#con).prepare('SELECT * FROM translation_shows');

		const res = (await getAllProjectsPreparedStatement).execute();
		

	}


	GetProjectByKeyWord(keyWord)
	{
		/*
		console.log(this.#projects);
		for(var i = 0; i < this.#projects.length; i++)
		{
			let _proj = this.#projects[i];
			for(var j = 0; j < _proj.keyWords.length; j ++)
				if (keyWord == _proj.keyWords[j])
					return _proj;
		}

		throw new RepositoryError("Proiect inexistent!");*/
			;
	}

}

module.exports = {
	RepoProjects: DBRepoProjects
}