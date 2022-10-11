import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

interface ContainerProps {
    color: string;
}

export const Container = styled.View<ContainerProps>`
    width: 100%;
    background-color: ${({ theme }) => theme.colors.shape};
    flex-direction: column;
    border-radius: 5px;
    border-left-width: 6px;
    border-left-color: ${({ color }) => color};
    padding-left: 4px;
    margin-bottom: 15px;
    margin-top: 2px;
`;

export const Icon = styled(MaterialCommunityIcons)`
    font-size: ${RFValue(18)}px;
    color: ${({ theme }) => theme.colors.text};
    margin-right: 5px;
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(13)}px;
`;

export const Amount = styled.Text`
    font-family: ${({ theme }) => theme.fonts.bold};
    font-size: ${RFValue(13)}px;
    margin-right: 3px;
`;

export const Header = styled.View`
    flex-direction: row;
    align-items: center;
    align-content: space-between;
    justify-content: space-between;
    margin-bottom: 23px;
`;

export const Description = styled.View`
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
`;

export const DescriptionTotals = styled.View`
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
`;

export const Footer = styled.View`
    width: 100%;
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const Account = styled.Text`
    font-size: ${RFValue(9)}px;
    padding-right: 5px;
`;

export const Total = styled.Text`
    font-size: ${RFValue(11)}px;
`;

export const Percent = styled.Text`
    font-size: ${RFValue(11)}px;
    margin-right: 3px;
`;
