import styled from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { BorderlessButton } from "react-native-gesture-handler";

interface ContainerProps {
    color: string;
}

interface ResidualProps {
    residual: string;
}

export const Container = styled.View<ContainerProps>`
    width: 100%;
    background-color: ${({ theme }) => theme.colors.shape};
    flex-direction: column;
    border-radius: 5px;
    border-left-width: 6px;
    border-left-color: ${({ color }) => color};
    padding: 4px 10px;
    margin-bottom: 10px;
`;

export const Icon = styled(MaterialCommunityIcons)`
    font-size: ${RFValue(20)}px;
    color: ${({ theme }) => theme.colors.text};
    margin-right: 5px;
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(11)}px;
`;

export const Amount = styled.Text`
    font-family: ${({ theme }) => theme.fonts.bold};
    font-size: ${RFValue(13)}px;
    margin-right: 4px;
`;

export const Header = styled.View`
    flex-direction: row;
    align-items: center;
    align-content: center;
    justify-content: space-between;
    margin-bottom: 23px;
`;

export const Description = styled.View`
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    margin-right: 4px;
`;

export const DescriptionTotals = styled.View`
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
`;

export const DeleteRegister = styled(BorderlessButton)``;

export const DeleteIcon = styled(Feather)`
    color: ${({ theme }) => theme.colors.attention};
    font-size: ${RFValue(20)}px;
`;

export const Footer = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
`;

export const Account = styled.Text`
    font-size: ${RFValue(10)}px;
    padding-right: 5px;
`;

export const Total = styled.Text`
    font-size: ${RFValue(12)}px;
`;

export const ResidualValue = styled.Text<ResidualProps>`
    font-size: ${RFValue(10)}px;
    margin-left: 4px;
    color: ${({ theme, residual }) =>
        residual.split("")[0] === "-"
            ? theme.colors.attention
            : theme.colors.primary};
`;

export const Percent = styled.Text`
    font-size: ${RFValue(11)}px;
    margin-right: 4px;
`;
