import React from "react";
import { TouchableOpacityProps } from "react-native";
import { RectButtonProps } from "react-native-gesture-handler";

import { Container, Icon, Title, Button } from "./styles";

const icons = {
    up: "arrow-up-circle",
    down: "arrow-down-circle",
    result: "dollar-sign",
};

interface Props extends RectButtonProps {
    title: string;
    type: "up" | "down" | "result";
    isActive: boolean;
}

export function TransactionTypeButtonForBudget({
    title,
    type,
    isActive,
    ...rest
}: Props) {
    return (
        <Container isActive={isActive} type={type}>
            <Button {...rest}>
                <Icon name={icons[type]} type={type} />
                <Title>{title}</Title>
            </Button>
        </Container>
    );
}
