const localStorageObj = {
    get: (name: string): any => {
        return localStorage.getItem(name);
    },
    set: (name: string, value: any) => {
        localStorage.setItem(name, value)
    },
    remove: (name: string) => {
        localStorage.removeItem(name)
    }
}

const cookie = {
    // Copy paste https://www.codegrepper.com/code-examples/javascript/typescript+set+cookie
    get: (name: string): any => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i=0;i < ca.length;i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    },
    set: (name: string, value: any, hours: number) => {
        const date = new Date();

        date.setTime(date.getTime() + (hours * 60 * 60 * 1000));

        // Set it
        document.cookie = name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
    },
    remove: (name: string) => {
        const date = new Date();

        // Set it expire in -1 days
        date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));

        // Set it
        document.cookie = name + "=; expires=" + date.toUTCString() + "; path=/";
    }
}

export {
    localStorageObj as localStorage,
    cookie
}
