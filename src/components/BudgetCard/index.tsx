import React from "react";

import {
    Container,
    Title,
    Amount,
    Header,
    Footer,
    Account,
    Total,
    Percent,
} from "./styles";

interface Props {
    title: string;
    amount: string;
    color: string;
}

export function BudgetCard({ title, amount, color }: Props) {
    return (
        <Container color={color}>
            <Header>
                <Title>{title}</Title>
                <Amount>{amount}</Amount>
            </Header>
            <Footer>
                <Account>Total para essa conta:</Account>
                <Total>R$ 699,27</Total>
                <Percent>54%</Percent>
            </Footer>
        </Container>
    );
}
