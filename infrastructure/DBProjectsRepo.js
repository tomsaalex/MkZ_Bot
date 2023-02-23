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

	/**
	 * Removes the project identified by the given key word from the repository.
	 * @async
	 * @param {string} projectKeyWord The key word that can identify the project to be dropped.
	 * @throws {RepositoryError} If no project exists in the repository that can be identified with the given key word.
	 * @throws {SqlError} If an unexpected error happens due to the database.
	*/
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

	/**
	 * Edits one field of the project identified by `keyWord` from the repository.
	 * @async
	 * @param {string} keyWord The key word that can identify the project to be edited.
	 * @param {string} propertyName The name of the field of the project to be edited.
	 * @param {*} newPropertyValue The new value to be attributed to `propertyName`.
	 * @throws {RepositoryError} If there is no project in the repository that can be identified by `keyWord`.
	 * @throws {TypeError} If a field of the project requires a value of a different type than `newPropertyValue`.
	 * @throws {SqlError} If an unexpected error happens due to the database.
	*/
	async EditProject(keyWord, propertyName, newPropertyValue)
	{
		let projectToUpdateDBEntryQuery = await this.#con.query(
			`SELECT id, title 
			FROM translation_shows_keywords TSK 
			INNER JOIN translation_shows TS ON TS.id = TSK.show_id 
			WHERE TSK.key_word = ?`, [keyWord]);
		
		if(projectToUpdateDBEntryQuery.length < 1)
		{
			throw new RepositoryError("There is no project identifiable with the key word " + keyWord);
		}	

		let projectTitle = projectToUpdateDBEntryQuery[0].title;
		let projectId = projectToUpdateDBEntryQuery[0].id;

		switch(propertyName)
		{
			case 'title': 
				let alterTitlePreparedStatement = await this.#con.prepare('UPDATE translation_shows SET title = ? WHERE id = ?');
				await alterTitlePreparedStatement.execute([newPropertyValue, projectId]);
				await alterTitlePreparedStatement.close();
			break;

			case 'cover':
				let alterCoverPreparedStatement = await this.#con.prepare('UPDATE translation_shows SET cover = ? WHERE id = ?');
				await alterCoverPreparedStatement.execute([newPropertyValue, projectId]);
				await alterCoverPreparedStatement.close();
			break;

			case 'episodes_num':
				if(typeof(newPropertyValue) != 'number')
					throw new TypeError("Noua valoare a atributului " + propertyName + " trebuie sa fie un numar");
				let alterEpisodesNumPreparedStatement = await this.#con.prepare('UPDATE translation_shows SET episodes_num = ? WHERE id = ?');
				await alterEpisodesNumPreparedStatement.execute([newPropertyValue, projectId]);
				await alterEpisodesNumPreparedStatement.close();
			break;

			default: throw new RepositoryError(propertyName + " nu este o proprietate valida ce poate fi modificata.\n");
		}

		return projectTitle;
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