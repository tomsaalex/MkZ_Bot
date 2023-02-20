const ProjectTypeError = require('../exceptions/project_type_error.js').ProjectTypeError

class ProjectType{
    #type;
    constructor(type){
        this.allowedTypes = ['anime', 'manga', 'bd'];
        if (this.allowedTypes.includes(type))
            this.#type = type;
        else{
            throw new ProjectTypeError("tip de proiect invalid.");
        }
    }

    get typeStringValue()
    {
        return this.#type;
    }

    static CheckEquality(type1, type2)
    {
        return type1.typeStringValue == type2.typeStringValue;
    }

    static Anime = new ProjectType("anime");
    static Manga = new ProjectType("manga");
    static BD = new ProjectType("bd");
}

module.exports = {
    ProjectType
}