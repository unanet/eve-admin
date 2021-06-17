class Config {
    API_URL: string
    READ_ONLY: boolean
    VERSION: string
    constructor() {
        this.VERSION = process.env.VUE_APP_VERSION
        this.API_URL = process.env.VUE_APP_API_URL || '/backend';
        this.READ_ONLY = (process.env.VUE_APP_READ_ONLY) ? JSON.parse(process.env.VUE_APP_READ_ONLY) : true;
    }
    isReadOnly(): boolean {
        return this.READ_ONLY;
    }
}

enum Roles {
    Admin
}

export {Roles}
export default new Config()

if (process.env.NODE_ENV === "development") {
    console.log(process.env)
    console.log(new Config())
}
