import cookie from 'js-cookie';


export const setCookie = (key, value) => {
    if (window !== undefined) {
        cookie.set(key, value, {
            expires: 2
        })
    }
};

export const removieCookie = key => {
    if (window !== undefined) {
        cookie.remove(key, {
            expires: 1
        })
    }
};

export const getCookie = key => {
    if (window !== undefined) {
        return cookie.get(key);
    }
};

export const setLocalStorage = (key, value) => {
    if (window !== undefined) {
        localStorage.setItem(key, JSON.stringify(value))
    }
};

export const removeLocalStorage = key => {
    if (window !== undefined) {
        localStorage.removeItem(key)
    }
};

export const authenticate = (response, next) => {
    setCookie('token', response.accessToken)
    setLocalStorage('user', response.user)
    next();
}

export const isAuth = () => {
    if (window !== undefined) {
        const getToken = getCookie('token')
        if (getToken) {
            if (localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'))
            } else {
                return false
            }
        }
    }
}

export const getJWTToken = () => {
    if (window !== undefined) {
        let jwt = getCookie('token');
        if (jwt) {
            return jwt
        } else {
            return false
        }
    }
}

export const signOut = next => {
    removieCookie('token');
    removeLocalStorage('user');
    next();
}

