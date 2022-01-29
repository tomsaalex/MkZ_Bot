class Project{
    constructor(id, title, keyWords, cover, episodesNum, type)
    {
        this._id = id;
        this._title = title;
        this._keyWords = keyWords;
        this._cover = cover;
        this._episodesNum = episodesNum;
        this._type = type;
    }

    get id()
    {
        return this._id
    }

    get title()
    {
        return this._title;
    }

    get keyWords()
    {
        return this._keyWords;
    }

    get cover()
    {
        return this._cover;
    }

    get episodesNum()
    {
        return this._episodesNum;
    }

    get type()
    {
        return this._type;
    }
}



module.exports = {
    Project
}