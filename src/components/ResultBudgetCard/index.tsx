import React from "react";

import { Container, Content, Icon, Title, Amount, Description } from "./styles";

interface Props {
    entrySum: string;
    expenseSum: string;
    result: string;
}

export function ResultBudgetCard({ entrySum, expenseSum, result }: Props) {
    return (
        <Container result={result}>
            <Content>
                <Description>
                    <Icon name="arrow-up-circle" type="up" />
                    <Title>Entradas</Title>
                </Description>
                <Description>
                    <Amount>{entrySum}</Amount>
                </Description>
            </Content>

            <Content>
                <Description>
                    <Icon name="arrow-down-circle" type="down" />
                    <Title>Saídas</Title>
                </Description>
                <Description>
                    <Amount>{expenseSum}</Amount>
                </Description>
            </Content>

            <Content>
                <Description>
                    <Icon name="dollar-sign" type="result" />
                    <Title>Resultado</Title>
                </Description>
                <Description>
                    <Amount>{result}</Amount>
                </Description>
            </Content>
        </Container>
    );
}
