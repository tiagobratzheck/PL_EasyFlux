import React from "react";

import { Button } from "../../components/Forms/Button";

import { Container, Header, Title, Footer } from "./styles";

interface HistoryAccountProps {
    category: string;
    closeHistoryAccount: () => void;
    selectedDate: Date;
}

export function HistoryAccount({
    category,
    selectedDate,
    closeHistoryAccount,
}: HistoryAccountProps) {
    console.log(category);
    console.log(selectedDate);
    return (
        <Container>
            <Header>
                <Title>Histórico</Title>
            </Header>
            <Footer>
                <Button title="Voltar" onPress={closeHistoryAccount}></Button>
            </Footer>
        </Container>
    );
}
