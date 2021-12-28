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

    static Anime = new ProjectType("anime");
    static Manga = new ProjectType("manga");
    static BD = new ProjectType("bd");
}

module.exports = {
    ProjectType
}