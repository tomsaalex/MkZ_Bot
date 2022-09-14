const ProjectTypeError = require('../exceptions/project_type_error.js').ProjectTypeError

class ProjectType{
    constructor(type){
        this.allowedTypes = ['anime', 'manga', 'bd'];
        if (this.allowedTypes.includes(type))
            this.type = type;
        else{
            throw new ProjectTypeError("tip de proiect invalid.");
        }
    }

    static CheckEquality(type1, type2)
    {
        return type1.type == type2.type;
    }

    static Anime = new ProjectType("anime");
    static Manga = new ProjectType("manga");
    static BD = new ProjectType("bd");
}

module.exports = {
    ProjectType
}