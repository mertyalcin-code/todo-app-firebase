export class User {
    
        public email: string;
        public id: string;
        public token: string;
        public tokenExpirationDate: Date ;
        
        constructor() {
            this.id = null;
            this.email = '';
            this.token = '';
            this.tokenExpirationDate = null;
        }

}