import React from "react";

import { isAfter } from "date-fns";

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
    DeleteRegister,
    DeleteIcon,
} from "./styles";

interface Props {
    selectedDate: Date;
    id: string;
    title: string;
    amount: string;
    color: string;
    icon: string;
    total: string;
    percent: string;
}

export function BudgetCard({
    selectedDate,
    id,
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
                <Description>
                    <Amount>{amount}</Amount>
                    {isAfter(selectedDate, new Date()) ? (
                        <DeleteRegister
                            onPress={() => {
                                console.log(id);
                            }}
                        >
                            <DeleteIcon name="delete" />
                        </DeleteRegister>
                    ) : null}
                </Description>
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
