const { JobTypeError } = require("../exceptions/job_type_error")


class Job{
    /*constructor(_id)
    {
        id = _id;
    }*/
}

class JobManager
{
    static Traducator = new Job()
    static Verificator = new Job()
    static Encoder = new Job()
    static Typesetter = new Job()
    static Timer = new Job()
    static QualityChecker = new Job()

    static Administrator = new Job()

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
}


module.exports = {
    JobManager
}