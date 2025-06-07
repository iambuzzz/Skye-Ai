import React, {useContext, useEffect, useState } from 'react';
import {createContext} from 'react';
import { checkAuthStatus, loginUser, logoutUser, signupUser } from '../helpers/api-communicator';
type User = {
    name: string;
    email: string;

}
type UserAuth = {
    isLoggedIn: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}
const AuthContext = createContext<UserAuth | null>(null);
export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        //fetch if users cookies are valid then skip login
        const checkStatus = async () => {
            try {
                const data = await checkAuthStatus();
                if (data) {
                    setUser({ name: data.name, email: data.email });
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error("Authentication check failed:", error);
                setIsLoggedIn(false);
            }
        };
        checkStatus();
    },[]);

    const login = async (email: string, password: string) => {
        const data = await loginUser(email, password);
        if (data) {
            setUser({ name: data.name, email: data.email });
            setIsLoggedIn(true);
        } else {
            throw new Error("Login failed");
        }
    }
    const signup = async (name: string, email: string, password: string) => {
        const data = await signupUser(name, email, password);
        if (data) {
            setUser({ name: data.name, email: data.email });
            setIsLoggedIn(true);
        } else {
            throw new Error("Login failed");
        }
    }
    const logout = async () => {
        await logoutUser();  
        setIsLoggedIn(false);
        setUser(null);
        // window.location.reload(); // Reload the page to clear any session data
    }
    const value = {
        isLoggedIn,
        user,
        login,
        signup,
        logout
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};
export const useAuth = () => {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return auth;
};