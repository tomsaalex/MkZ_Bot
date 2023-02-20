class Project{
    
    #id;
    #title;
    #keyWords;
    #cover;
    #episodesNum;
    #projectType;
    
    constructor(title, keyWords, cover, episodesNum, type)
    {
        this.#title = title;
        this.#keyWords = keyWords;
        this.#cover = cover;
        this.#episodesNum = episodesNum;
        this.#projectType = type;
    }

    set id(id)
    {
        this.#id = id;
    }

    get id()
    {
        return this.#id
    }

    get title()
    {
        return this.#title;
    }

    get keyWords()
    {
        return this.#keyWords;
    }

    get cover()
    {
        return this.#cover;
    }

    get episodesNum()
    {
        return this.#episodesNum;
    }

    get projectType()
    {
        return this.#projectType;
    }
}



module.exports = {
    Project
}