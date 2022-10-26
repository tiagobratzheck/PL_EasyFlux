import styled from "styled-components/native";

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import theme from "../../global/styles/theme";

export const Container = styled(GestureHandlerRootView)`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
    justify-content: space-between;
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

export const Content = styled.ScrollView`
    flex: 1;
    margin-top: 15px;
`;

export const Footer = styled.View`
    width: 100%;
    padding: 24px;
`;

export const LoadContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    margin-top: 60px;
`;

export const CategoryInformation = styled.View`
    width: 100%;
    flex-direction: row;
    align-content: center;
    justify-content: center;
`;

export const Icon = styled(MaterialCommunityIcons)`
    font-size: ${RFValue(25)}px;
    color: ${({ theme }) => theme.colors.text};
    margin-right: 5px;
`;

export const CategoryName = styled.Text`
    font-size: ${RFValue(20)}px;
    font-family: ${({ theme }) => theme.fonts.regular};
`;
