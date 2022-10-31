import styled, { css } from "styled-components/native";
import { RFValue } from "react-native-responsive-fontsize";
import { Feather } from "@expo/vector-icons";

import { RectButton } from "react-native-gesture-handler";

interface IconsProps {
    type: "up" | "down" | "result";
}

interface ContainerProps {
    isActive: boolean;
    type: "up" | "down" | "result";
}

export const Container = styled.View<ContainerProps>`
    width: 30%;
    border: 1.5px;
    border-width: ${({ isActive }) => (isActive ? 0 : 1.5)}px;
    border-style: solid;
    border-color: ${({ theme }) => theme.colors.text};
    border-radius: 5px;

    ${({ isActive, type }) =>
        isActive &&
        type === "up" &&
        css`
            background-color: ${({ theme }) => theme.colors.success_light};
        `}

    ${({ isActive, type }) =>
        isActive &&
        type === "down" &&
        css`
            background-color: ${({ theme }) => theme.colors.attention_light};
        `}

    ${({ isActive, type }) =>
        isActive &&
        type === "result" &&
        css`
            background-color: ${({ theme }) => theme.colors.secondary_light};
        `}
`;

export const Button = styled(RectButton)`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 12px;
`;

export const Icon = styled(Feather)<IconsProps>`
    font-size: ${RFValue(20)}px;
    margin-right: 12px;

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
    font-size: ${RFValue(10)}px;
    color: ${({ theme }) => theme.colors.text_dark};
`;
