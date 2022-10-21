import styled from "styled-components/native";

import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { getStatusBarHeight } from "react-native-iphone-x-helper";

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

export const Footer = styled.View`
    width: 100%;
    padding: 24px;
`;
