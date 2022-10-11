import React from "react";

import {
    Container,
    Icon,
    Title,
    Amount,
    Header,
    Description,
    Footer,
    DescriptionTotals,
    Account,
    Total,
    Percent,
} from "./styles";

interface Props {
    title: string;
    amount: string;
    color: string;
    icon: string;
    total: string;
    percent: string;
}

export function BudgetCard({
    title,
    amount,
    color,
    icon,
    total,
    percent,
}: Props) {
    return (
        <Container color={color}>
            <Header>
                <Description>
                    <Icon name={icon} />
                    <Title>{title}</Title>
                </Description>
                <Amount>{amount}</Amount>
            </Header>
            <Footer>
                <DescriptionTotals>
                    <Account>Total para essa conta:</Account>
                    <Total>{total}</Total>
                </DescriptionTotals>
                <Percent>{percent}</Percent>
            </Footer>
        </Container>
    );
}
