const { JobManager } = require("../validators/job_validator")

class Episode
{
    constructor(showID, num)
    {
        this._showID = showID
        this._num = num
        this._traducere = false
        this._verificare = false
        this._encode = false
        this._typesetting = false
        this._qc = false
        this._timing = false
    }

    SetState(job, newValue)
    {
        switch(job)
        {
            case JobManager.Traducator: this._traducere = newValue; break;
            case JobManager.Verificator: this._verificare = newValue; break;
            case JobManager.Encoder: this._encode = newValue; break;
            case JobManager.Typesetter: this.typesetting = newValue; break;
            case JobManager.QualityChecker: this.qc = newValue; break;
            case JobManager.Timer: this.timing = newValue; break;
        }
    }

    get showID()
    {
        return this._showID
    }

    get num()
    {
        return this._num
    }
    
    get traducere()
    {
        return this._traducere
    }

    get verificare()
    {
        return this._verificare
    }

    get encode()
    {
        return this._encode
    }

    get typesetting()
    {
        return this._typesetting
    }

    get timing()
    {
        return this._timing
    }

    get qc()
    {
        return this._qc
    }

    set traducere(traducereState)
    {
        this._traducere = traducereState
    }

    set verificare(verificareState)
    {
        this._verificare = verificareState
    }

    set encode(encodeState)
    {
        this._encode = encodeState
    }

    set typesetting(typesettingState)
    {
        this._typesetting = typesettingState
    }

    set timing(timingState)
    {
        this._timing = timingState
    }

    set qc(qcState)
    {
        this._qc = qcState
    }

    

}

module.exports = {
    Episode
}