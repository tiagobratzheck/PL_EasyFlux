import React from "react";

import { Container, Button, Title, Amount } from "./styles";

interface Props {
    title: string;
    amount: string;
    color: string;
    onPress: () => void;
}

export function HistoryCard({ title, amount, color, onPress }: Props) {
    return (
        <Container color={color}>
            <Button onPress={onPress}>
                <Title>{title}</Title>
                <Amount>{amount}</Amount>
            </Button>
        </Container>
    );
}
