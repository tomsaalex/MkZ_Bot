class Project{
    constructor(title, keyWords, cover, episodesNum, type)
    {
        this.title = title;
        this.keyWords = keyWords;
        this.cover = cover;
        this.episodesNum = episodesNum;
        this.type = type;
    }

    get title()
    {
        return this.title;
    }

    get keyWords()
    {
        return this.keyWords;
    }

    get cover()
    {
        return this.cover;
    }

    get episodesNum()
    {
        return this.episodesNum;
    }

    get type()
    {
        return this.type;
    }
}



module.exports = {
    Project
}