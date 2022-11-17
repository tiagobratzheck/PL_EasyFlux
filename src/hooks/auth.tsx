import React, { createContext, ReactNode, useContext, useState } from "react";

import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthProviderProps {
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface AuthContextData {
    user: User;
    signInWithGoogleRequest(): Promise<void>;
    signInWithApple(): Promise<void>;
    signOut(): Promise<void>;
    userStorageLoading: boolean;
}

const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>({} as User);
    const [userStorageLoading, setUserStorageLoading] = useState(true);
    const userStorageKey = "@EasyFlux:user";

    const [googleRequest, googleResponse, googlePromptAsync] =
        Google.useAuthRequest({
            androidClientId:
                "202885171437-in7tvfaesfm45jlhinp333257ki1o625.apps.googleusercontent.com",
        });

    async function signInWithGoogleRequest() {
        try {
            setUserStorageLoading(true);
            await googlePromptAsync();
        } catch (error) {
            setUserStorageLoading(false);
            console.log(error);
            throw error;
        }
    }

    async function signInWithGoogle(accessToken: string) {
        try {
            const response = await fetch(
                `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
            );
            const userInfo = await response.json();
            const userLoggedIn = {
                id: userInfo.id,
                name: userInfo.given_name,
                email: userInfo.email,
                photo: userInfo.picture,
            };

            setUser(userLoggedIn);
            await AsyncStorage.setItem(
                userStorageKey,
                JSON.stringify(userLoggedIn)
            );
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setUserStorageLoading(false);
        }
    }

    async function signInWithApple() {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });
            if (credential) {
                const name = credential.fullName!.givenName!;
                const photo = `https://ui-avatars.com/api/?name=${name}`;
                const userLogged = {
                    id: String(credential.user),
                    email: credential.email!,
                    name,
                    photo,
                };

                setUser(userLogged);
                await AsyncStorage.setItem(
                    userStorageKey,
                    JSON.stringify(userLogged)
                );
            }
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async function signOut() {
        setUser({} as User);
        await AsyncStorage.removeItem(userStorageKey);
    }

    React.useEffect(() => {
        async function loadUserStorageDate() {
            const data = await AsyncStorage.getItem(userStorageKey);
            if (data) {
                const userLogged = JSON.parse(data) as User;
                setUser(userLogged);
            }
            setUserStorageLoading(false);
        }
        loadUserStorageDate();
    }, []);

    React.useEffect(() => {
        if (
            googleResponse?.type === "success" &&
            googleResponse.authentication?.accessToken
        ) {
            signInWithGoogle(googleResponse.authentication.accessToken);
        } else if (userStorageLoading) {
            setUserStorageLoading(false);
        }
    }, [googleResponse]);

    return (
        <AuthContext.Provider
            value={{
                user,
                signInWithGoogleRequest,
                signInWithApple,
                signOut,
                userStorageLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);

    return context;
}

export { AuthProvider, useAuth };
