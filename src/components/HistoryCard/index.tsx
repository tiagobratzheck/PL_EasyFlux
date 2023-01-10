import React from "react";

import { Amount, Button, Container, Footer, Percent, Title } from "./styles";

interface Props {
    title: string;
    amount: string;
    percent: string;
    color: string;
    onPress: () => void;
}

export function HistoryCard({ title, amount, percent, color, onPress }: Props) {
    return (
        <Container color={color}>
            <Button onPress={onPress}>
                <Title>{title}</Title>
                <Footer>
                    <Amount>{amount}</Amount>
                    <Percent>{percent}</Percent>
                </Footer>
            </Button>
        </Container>
    );
}
