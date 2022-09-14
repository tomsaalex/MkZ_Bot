const { JobTypeError } = require("../exceptions/job_type_error")
const ProjectType = require('../domain/entity_project_type.js').ProjectType

class Job{
    constructor(name)
    {
        this.jobName = name;
    }
}

class JobManager
{
    static Traducator = new Job("traducere")
    static Verificator = new Job("verificare")
    static Encoder = new Job("encode")
    static Typesetter = new Job("typesetting")
    static Timer = new Job("timing")
    static QualityChecker = new Job("quality check")

    static Administrator = new Job("admin")

    static IdentifyJob(jobKeyWord)
    {
        switch(jobKeyWord)
        {
            case "traducere": return JobManager.Traducator
            case "verificare": return JobManager.Verificator
            case "encode": return JobManager.Encoder
            case "typesetting": return JobManager.Typesetter
            case "timing": return JobManager.Timer
            case "qc": return JobManager.QualityChecker
            default: throw new JobTypeError("Nu exista job-ul: " + jobKeyWord);
        }
    }

    static CheckJobCompatibility(job, project)
    {
        switch(job)
        {
            case JobManager.Traducator: return (ProjectType.CheckEquality(project.type, ProjectType.Anime) || ProjectType.CheckEquality(project.type, ProjectType.Manga));
            case JobManager.Verificator: return (ProjectType.CheckEquality(project.type, ProjectType.Anime) || ProjectType.CheckEquality(project.type, ProjectType.Manga));
            case JobManager.Encoder: return (ProjectType.CheckEquality(project.type, ProjectType.Anime) || ProjectType.CheckEquality(project.type, ProjectType.BD));
            case JobManager.Typesetter: return (ProjectType.CheckEquality(project.type, ProjectType.Anime) || ProjectType.CheckEquality(project.type, ProjectType.BD));
            case JobManager.Timer: return ((ProjectType.CheckEquality(project.type, ProjectType.Anime) && project.enabledTiming) || ProjectType.CheckEquality(project.type, ProjectType.BD));
            case JobManager.QualityChecker: return (ProjectType.CheckEquality(project.type, ProjectType.Anime) && project.enabledQC || ProjectType.CheckEquality(project.type, ProjectType.BD));
            default: throw new JobTypeError("Job nerecunoscut");
        }
    }
}


module.exports = {
    JobManager
}