import React from "react";
import { Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "styled-components";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Dashboard } from "../screens/Dashboard";
import { Register } from "../screens/Register";
import { Resume } from "../screens/Resume";
import { Budget } from "../screens/Budget";

import { DateProvider } from "../../src/hooks/date";

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
    const theme = useTheme();
    return (
        <DateProvider>
            <Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: theme.colors.secondary,
                    tabBarInactiveTintColor: theme.colors.text,
                    //tabBarLabelPosition: 'beside-icon',
                    tabBarStyle: {
                        height: 60,
                        paddingVertical: Platform.OS === "ios" ? 20 : 0,
                        paddingBottom: 10,
                    },
                }}
            >
                <Screen
                    name="Listagem"
                    component={Dashboard}
                    options={{
                        tabBarIcon: ({ size, color }) => (
                            <MaterialIcons
                                name="format-list-bulleted"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
                <Screen
                    name="Cadastrar"
                    component={Register}
                    options={{
                        tabBarIcon: ({ size, color }) => (
                            <MaterialIcons
                                name="attach-money"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
                <Screen
                    name="Resumo"
                    component={Resume}
                    options={{
                        tabBarIcon: ({ size, color }) => (
                            <MaterialIcons
                                name="bar-chart"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
                <Screen
                    name="Orçamento"
                    component={Budget}
                    options={{
                        tabBarIcon: ({ size, color }) => (
                            <MaterialIcons
                                name="table-view"
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
            </Navigator>
        </DateProvider>
    );
}
