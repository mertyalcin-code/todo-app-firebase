export class Todo{
    public id:string;
    public text:string;
    public status:boolean;
    public creator:string;
    public creationDate:Date;

    constructor() {
        this.id = null;
        this.text = '';
        this.status = false;
        this.creator = '';
        this.creationDate = new Date();
    }
}