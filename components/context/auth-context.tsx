import React, {createContext, useState, ReactNode,useContext, useEffect} from 'react'
import Decode from 'jwt-decode'


type authContextType = {
    isLoggedIn: boolean;
    id:string;
    username:string;
    login: () => void;
    logout: () => void;
};
type AccessToken = {
    exp:number;
    iat:number;
    id:string;
    username:string
}
// exp: 1618659964
// iat: 1618656364
// id: "6076f5bea3db6313746e77be"
// username: "banguis"

const authContextDefaultValues: authContextType = {
    isLoggedIn: false,
    id:'',
    username:'',
    login: () => {},
    logout: () => {},
};

const AuthContext = createContext<authContextType>(authContextDefaultValues);

export const useAuth = () => {
    return useContext(AuthContext);
}

type Props = {
    children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [DecodedToken, setDecodedToken] = useState<AccessToken>(JSON.parse(localStorage.getItem('token')))



    const login = () => {
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('token')
        setIsLoggedIn(false);
    };

    const value = {
        isLoggedIn:isLoggedIn,
        id:DecodedToken?.id,
        username:DecodedToken?.username,
        login,
        logout,
    };

 
 

        useEffect(() => {

            const token = JSON.parse(localStorage.getItem('token'))

            if(token && token !== null) {
                const decoded:AccessToken = Decode(token)
                if (Date.now() >= decoded?.exp * 1000) {
                    logout()
                } else {
                    login()
                }
                setDecodedToken(decoded)
            } else {
                logout()
            }
        },[])

    return (
            <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
    );
}