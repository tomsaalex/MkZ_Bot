const { PermissionValidator } = require('../validators/permission_validator');
const { PermissionError } = require('../exceptions/permission_error');
const { MissingArgumentError } = require('../exceptions/missing_argument_error');
const { Project } = require('../domain/project');
const { Episode } = require('../domain/episode');
const { JobManager } = require('../validators/job_validator');
const { RepositoryError } = require('../exceptions/repository_error');
const {ProjectType} = require('../domain/ProjectType');


class ServiceProject {
	constructor(repo_project, repo_episodes) {
		this.repo_project = repo_project;
		this.repo_episodes = repo_episodes;
	}

	StartCommand(msg, args) {
		//start: --start [keyWord serie] [număr / nume episod] (începe traducerea unui episod)
		PermissionValidator.ValidateUserPermissions(msg.member, JobManager.Administrator);

		let errorString = "";
		if (args[0] == null)
			errorString += "Nume serie\n";
		if(args[1] == null)
			errorString += "Număr episod\n";

		if(errorString.length > 0)
		{
			throw new MissingArgumentError(errorString);
		}

		let project = this.repo_project.GetProjectByKeyWord(args[0]);
		
		
	}

	UpdateCommand(msg, args)
	{
		//update: --update [keyWord serie] [nr. episod] [etapa procesului de traducere] [(opțional) "-not"]
		
		let errorString = "";

		if(args[0] == null)
			errorString += "keyWord\n";
		if(args[1] == null)
			errorString += "nr. episod\n";
		if(args[2] == null)
			errorString += "job\n";
		
		if (errorString.length > 0)
			throw new MissingArgumentError(errorString);

		let job = JobManager.IdentifyJob(args[2]);
		PermissionValidator.ValidateUserPermissions(msg.member, job);
		
		let project = this.repo_project.GetProjectByKeyWord(args[0]);
		let episodeNum = Number(args[1]);
		let enableProperty = (args[3] == "-not" ? false : true);

		let episodeToChange;
		try
		{	
		 	episodeToChange = this.repo_episodes.GetEpisode(project.id, episodeNum);
		}
		catch (error)
		{
			if(error instanceof RepositoryError)
				{
					episodeToChange = new Episode(project.id, episodeNum);
					this.repo_episodes.AddEpisode(episodeToChange);
				}
		}
		
		if(JobManager.CheckJobCompatibility(job, project))
		{
			episodeToChange.SetState(job, enableProperty);
		}
		console.log(episodeToChange);
	}

	/**
	 * Handles the general task of adding a project to the repository of projects.
	 * @async
	 * @param {Message} message The message that triggered the addition operation.
	 * @param {string[]} args The arguments passed to the command. In order: the project type, the project's title, the project's number of episodes, the project's cover art, the project's list of identifying key words.
	 * @throws {RepositoryError} If a project exists in the repository that has the same title or at least one key word identical with `project`.
	 * @throws {SqlError} If an unexpected error happens due to the database.
	 * @throws {MissingArgumentError} If one of the expected arguments from args is missing.
	 * @throws {PermissionError} If the user doesn't have sufficient permissions to add a new project.
	 * @returns The title of the project added to the repository.
	 */
	async AddCommand(message, args) {
		//--add [tip serie: anime/manga/BD][nume serie][numar episoade][URL pentru thumbnail-ul seriei] [lista de cuvinte cheie a seriei] (adaugă o serie nouă pe baza parametrilor)
		PermissionValidator.ValidateUserPermissions(message.member, JobManager.Administrator);
		
		const ARG_INDEX_PROJECT_TYPE = 0;
		const ARG_INDEX_TITLE = 1;
		const ARG_INDEX_EPISODES_NUM = 2;
		const ARG_INDEX_COVER = 3;
		const ARG_INDEX_START_KEYWORDS = 4;

		let errorString = "";
		
		if(args[ARG_INDEX_PROJECT_TYPE] == null)
			errorString += "tipul proiectului\n";
		if (args[ARG_INDEX_TITLE] == null)
			errorString += "titlu\n";
		if(args[ARG_INDEX_EPISODES_NUM] == null)
			errorString += "nr. episoade";
		if (args[ARG_INDEX_COVER] == null)
			errorString += "cover\n";
		if (args[ARG_INDEX_START_KEYWORDS] == null)
			errorString += "keyWord\n";
		if (errorString.length > 0)
			throw new MissingArgumentError(errorString);
		
		args[ARG_INDEX_PROJECT_TYPE] = args[ARG_INDEX_PROJECT_TYPE].toLowerCase();
		let currentType = new ProjectType(args[ARG_INDEX_PROJECT_TYPE]);
		
		args[ARG_INDEX_TITLE] = args[ARG_INDEX_TITLE].replace(/---/g, " ");

		let keyWords = new Array();
		let i = ARG_INDEX_START_KEYWORDS;
		while (args[i] != null) {
			keyWords.push(args[i++].toLowerCase());
		}
		let project = new Project(args[ARG_INDEX_TITLE], keyWords, args[ARG_INDEX_COVER], args[ARG_INDEX_EPISODES_NUM], currentType);

		await this.repo_project.AddProject(project);

		return args[ARG_INDEX_TITLE];
	}

	/**
	 * Handles the general task of removing a project from the repository of projects.
	 * @async
	 * @param {Message} message The message that triggered the addition operation.
	 * @param {string[]} args The arguments passed to the command. In order: key word to identify the project.
	 * @throws {RepositoryError} If no project exists in the repository that can be identified with the given key word.
	 * @throws {SqlError} If an unexpected error happens due to the database.
	 * @throws {MissingArgumentError} If one of the expected arguments from args is missing.
	 * @returns A list of 2 elements containing the key word used to identify a project, and the title of the project dropped.
	 */
	async DropCommand(message, args)
	{
		//--drop [cuvant cheie pentru serie] (înlatură o serie din lista bot-ului)
		PermissionValidator.ValidateUserPermissions(message.member, JobManager.Administrator);
		let errorString = "";
		if(args[0] == null)
			errorString += "key word";
		if(errorString.length > 0)
			throw new MissingArgumentError(errorString);

		let title = await this.repo_project.DropProject(args[0]);
		return [args[0], title];
	}

	async EditCommand(mesage, args)
	{
		//--edit [nume serie] [proprietatea care trebuie editată] [noua valoare a proprietății] (editează una dintre proprietățile unei serii)
	
		PermissionValidator.ValidateUserPermissions(message.member, JobManager.Administrator);
		

	}
}

module.exports = {
	ServiceProject
}