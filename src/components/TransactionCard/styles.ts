import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { BorderlessButton } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

interface TransactionProps {
    type: "positive" | "negative";
}

export const Container = styled.View`
    background-color: ${({ theme }) => theme.colors.shape};
    border-radius: 5px;
    padding: 17px 24px;
    margin-bottom: 16px;
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(12)}px;
`;

export const Amount = styled.Text<TransactionProps>`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(20)}px;
    margin-top: 2px;

    color: ${({ theme, type }) =>
        type === "positive" ? theme.colors.success : theme.colors.attention};
`;

export const Footer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 19px;
`;

export const Category = styled.View`
    flex-direction: row;
    align-items: center;
`;

export const Icon = styled(MaterialCommunityIcons)`
    font-size: ${RFValue(20)}px;
    color: ${({ theme }) => theme.colors.text};
`;

export const CategoryName = styled.Text`
    font-size: ${RFValue(14)}px;
    color: ${({ theme }) => theme.colors.text};
    margin-left: 17px;
`;

export const DisplayDate = styled.Text`
    font-size: ${RFValue(14)}px;
    color: ${({ theme }) => theme.colors.text};
`;

export const DocumentAttached = styled(BorderlessButton)`
    margin-right: 9px;
`;

export const DocumentIcon = styled(Feather)`
    color: ${({ theme }) => theme.colors.document};
    font-size: ${RFValue(20)}px;
`;

export const DeleteRegister = styled(BorderlessButton)``;

export const DeleteIcon = styled(Feather)`
    color: ${({ theme }) => theme.colors.attention};
    font-size: ${RFValue(20)}px;
`;

export const Description = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    margin-right: 4px;
`;

export const IconsBox = styled.View`
    flex-direction: row;
    justify-content: flex-end
`
