import { RectButton } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

interface ContainerProps {
    color: string;
}

export const Container = styled.View<ContainerProps>`
    width: 100%;
    background-color: ${({ theme }) => theme.colors.shape};
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-radius: 5px;
    border-left-width: 6px;
    border-left-color: ${({ color }) => color};
    margin-bottom: 9px;
`;

export const Button = styled(RectButton).attrs({
    activeOpacity: 0.7,
})`
    width: 100%;
    padding: 12px 24px;
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(13)}px;
`;

export const Footer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

export const Amount = styled.Text`
    font-family: ${({ theme }) => theme.fonts.bold};
    font-size: ${RFValue(13)}px;
`;

export const Percent = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(10)}px;
`
