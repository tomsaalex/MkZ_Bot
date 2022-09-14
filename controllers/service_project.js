const { PermissionValidator } = require('../validators/permission_validator');
const { PermissionError } = require('../exceptions/permission_error');
const { ProjectType } = require('../domain/entity_project_type');
const { MissingArgumentError } = require('../exceptions/missing_argument_error');
const { Project } = require('../domain/entity_project');
const { Episode } = require('../domain/entity_episode');
const { JobManager } = require('../validators/job_validator');
const { RepositoryError } = require('../exceptions/repository_error');


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

	AddCommand(msg, args) {
		//--add [tip serie: anime/manga/BD][nume serie] [URL pentru thumbnail-ul seriei] [lista de cuvinte cheie a seriei] (adaugă o serie nouă pe baza parametrilor)
		PermissionValidator.ValidateUserPermissions(msg.member, JobManager.Administrator);

		let currentType = new ProjectType(args[0]);
		
		let errorString = "";

		if (args[1] == null)
			errorString += "titlu\n";
		if (args[2] == null)
			errorString += "cover\n";
		if (args[3] == null)
			errorString += "keyWord\n";
		if (errorString.length > 0)
			throw new MissingArgumentError(errorString);

		args[1] = args[1].replace(/---/g, " ");

		//I need to move this out of here, but I'm not yet sure where
		let keyWords = new Array();
		let i = 3;
		while (args[i] != null) {
			keyWords.push(args[i++].toLowerCase());
		}
		let project_id = this.repo_project.GetNextID();
		let project = new Project(project_id, args[1], keyWords, args[2], null, currentType);

		this.repo_project.AddProject(project);

		return args[1];
	}
}

module.exports = {
	ServiceProject
}