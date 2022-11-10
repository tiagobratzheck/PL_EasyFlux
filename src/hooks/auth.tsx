import React, { createContext, ReactNode, useContext, useState } from "react";

const { WEB_CLIENT_ID, ANDROID_ID } = process.env;
const { REDIRECT_URI } = process.env;

import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as AppleAuthentication from "expo-apple-authentication";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeRedirectUri, ResponseType } from "expo-auth-session";

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
    signInWithFacebookRequest(): Promise<void>;
    signInWithApple(): Promise<void>;
    signOut(): Promise<void>;
    userStorageLoading: boolean;
}

interface AuthorizationResponse {
    params: {
        access_token: string;
    };
    type: string;
}

const AuthContext = createContext({} as AuthContextData);

//WebBrowser.maybeCompleteAuthSession();

function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>({} as User);
    const [userStorageLoading, setUserStorageLoading] = useState(true);
    const userStorageKey = "@EasyFlux:user";

    const [googleRequest, googleResponse, googlePromptAsync] =
        Google.useAuthRequest({
            expoClientId: WEB_CLIENT_ID,
            androidClientId:
                "202885171437-in7tvfaesfm45jlhinp333257ki1o625.apps.googleusercontent.com",
        });

    const [facebookRequest, facebookResponse, facebookPromptAsync] =
        Facebook.useAuthRequest({
            clientId: "488498116581123",
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

    async function signInWithFacebookRequest() {
        try {
            setUserStorageLoading(true);
            await facebookPromptAsync();
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
            console.log(userInfo);
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

    async function signInWithFacebook(accessToken: string) {
        try {
            const response = await fetch(
                `https://graph.facebook.com/me?fields=first_name,last_name,email&access_token=${accessToken}`
            );
            const userInfo = await response.json();
            console.log(userInfo);
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
                const photo = `https://ui-avatar.com/api/?name=${name}&lenght=1`;
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

    //React.useEffect(() => {
    //    async function loadUserStorageDate() {
    //        const data = await AsyncStorage.getItem(userStorageKey);
    //        if (data) {
    //            const userLogged = JSON.parse(data) as User;
    //            setUser(userLogged);
    //        }
    //        setUserStorageLoading(false);
    //    }
    //    loadUserStorageDate();
    //}, []);

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

    React.useEffect(() => {
        if (
            facebookResponse?.type === "success" &&
            facebookResponse.authentication?.accessToken
        ) {
            signInWithFacebook(facebookResponse.authentication.accessToken);
        } else if (userStorageLoading) {
            setUserStorageLoading(false);
        }
    }, [facebookResponse]);

    return (
        <AuthContext.Provider
            value={{
                user,
                signInWithGoogleRequest,
                signInWithFacebookRequest,
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
