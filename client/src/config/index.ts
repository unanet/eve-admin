class Config {
    API_URL: string
    READ_ONLY: boolean
    VERSION: string
    KEYCLOAK_OPTIONS: Record<string, any>
    constructor() {
        this.VERSION = process.env.VUE_APP_VERSION
        this.API_URL = process.env.VUE_APP_API_URL || '/backend';
        this.READ_ONLY = (process.env.VUE_APP_READ_ONLY) ? JSON.parse(process.env.VUE_APP_READ_ONLY) : true;
        this.KEYCLOAK_OPTIONS = {
            url: 'https://idp.unanet.io/auth',
            realm: 'devops',
            clientId: 'cloud-api',
            onLoad: 'login-required',
        }
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
