import "react-native-gesture-handler";
import "intl";
import "intl/locale-data/jsonp/pt-BR";
import React from "react";

import { StatusBar } from "react-native";
import { ThemeProvider } from "styled-components";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useFonts } from "expo-font";

import {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import theme from "./src/global/styles/theme";

import { AuthProvider, useAuth } from "./src/hooks/auth";
import { Routes } from "./src/routes";

export default function App() {
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold,
    });

    const { userStorageLoading } = useAuth();

    if (!fontsLoaded || userStorageLoading) {
        return null;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider theme={theme}>
                <StatusBar
                    backgroundColor={theme.colors.primary}
                    barStyle="light-content"
                />
                <AuthProvider>
                    <Routes />
                </AuthProvider>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
