import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { Platform } from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import theme from "../../global/styles/theme";

interface CategoryProps {
    isActive: boolean;
}

export const Container = styled(GestureHandlerRootView)`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
    width: 100%;
    height: ${RFValue(60)}px;
    background-color: ${({ theme }) => theme.colors.primary};
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 19px;
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(13)}px;
    color: ${({ theme }) => theme.colors.shape};
`;

export const Category = styled.TouchableOpacity<CategoryProps>`
    width: 100%;
    padding: ${RFValue(12)}px;
    flex-direction: row;
    align-items: center;

    background-color: ${({ isActive }) =>
        isActive ? theme.colors.secondary_light : theme.colors.background};
`;

export const Icon = styled(MaterialCommunityIcons)`
    font-size: ${RFValue(17)}px;
    margin-right: 16px;
`;

export const Name = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(12)}px;
`;

export const Separator = styled.View`
    height: 1px;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.title};
`;

export const Footer = styled.View`
    width: 100%;
    padding: 24px;
`;
