const config = {
    EVE_API_URL: process.env.VUE_APP_EVE_API_URL || "http://localhost:8081/api",
}

class Config {
    API_URL: string
    READ_ONLY: boolean
    constructor() {
        this.API_URL = process.env.VUE_APP_EVE_API_URL || "http://localhost:8081/api";
        this.READ_ONLY = (process.env.VUE_APP_READ_ONLY) ? JSON.parse(process.env.VUE_APP_READ_ONLY) : false;
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
    console.log(config)
}
