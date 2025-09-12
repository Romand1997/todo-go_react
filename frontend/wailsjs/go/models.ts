export namespace main {
	
	export class Task {
	    ID: number;
	    Title: string;
	    Completed: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Task(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Title = source["Title"];
	        this.Completed = source["Completed"];
	    }
	}

}

