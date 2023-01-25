import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";

import { Container, ContainerView, Title } from "./styles";

interface Props extends RectButtonProps {
    themeColor?: "secondary" | "light";
    title: string;
    onPress: () => void;
}

export function Button({ themeColor = 'secondary', title, onPress, ...rest }: Props) {
    return (
        <ContainerView themeColor={themeColor}>
            <Container themeColor={themeColor} onPress={onPress} {...rest}>
                <Title themeColor={themeColor} >{title}</Title>
            </Container>
        </ContainerView>
    );
}
