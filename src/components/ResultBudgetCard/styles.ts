import styled, { css } from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

interface ContainerProps {
    result: string;
}

interface IconsProps {
    type: "up" | "down" | "result";
}

export const Container = styled.View<ContainerProps>`
    width: 100%;
    background-color: ${({ theme }) => theme.colors.shape};
    flex-direction: column;
    border-radius: 5px;
    border-left-width: 6px;
    border-left-color: ${({ theme, result }) =>
        result.split("")[0] === "-"
            ? theme.colors.attention
            : theme.colors.primary};
    padding: 4px 15px;
    margin-bottom: 10px;
`;

export const Content = styled.View`
    flex-direction: row;
    margin-bottom: 3px;
    justify-content: space-between;
`;

export const Icon = styled(Feather)<IconsProps>`
    font-size: ${RFValue(20)}px;
    margin-right: 5px;
    ${({ type }) =>
        type === "up" &&
        css`
            color: ${({ theme }) => theme.colors.success};
        `}
    ${({ type }) =>
        type === "down" &&
        css`
            color: ${({ theme }) => theme.colors.attention};
        `}
     ${({ type }) =>
        type === "result" &&
        css`
            color: ${({ theme }) => theme.colors.secondary};
        `}
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(13)}px;
`;

export const Amount = styled.Text`
    font-family: ${({ theme }) => theme.fonts.bold};
    font-size: ${RFValue(13)}px;
    margin-right: 4px;
`;

export const Description = styled.View`
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
    margin-right: 4px;
`;
