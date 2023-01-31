import React from "react";

import { isAfter } from "date-fns";
import { useDate } from "../../hooks/date";

import {
    Amount,
    Container,
    Content,
    Description,
    Icon,
    Result,
    Title
} from "./styles";

interface Props {
    entrySum: string;
    budgetEntrySum: string;
    expenseSum: string;
    budgetExpenseSum: string;
    result: string;
    budgetResultSum: string;
}

export function ResultActualCard({
    entrySum,
    budgetEntrySum,
    expenseSum,
    budgetExpenseSum,
    result,
    budgetResultSum,
}: Props) {
    const { dateTransactions } = useDate();

    return (
        <Container result={result}>
            <Content>
                <Description>
                    <Icon name="arrow-up-circle" type="up" />
                    <Title>Entradas</Title>
                    {isAfter(dateTransactions, new Date()) ? null : (
                        <Result result={budgetEntrySum}>
                            {`(${budgetEntrySum})`}
                        </Result>
                    )}
                </Description>
                <Description>
                    <Amount>{entrySum}</Amount>
                </Description>
            </Content>

            <Content>
                <Description>
                    <Icon name="arrow-down-circle" type="down" />
                    <Title>Saídas</Title>
                    {isAfter(dateTransactions, new Date()) ? null : (
                        <Result result={budgetExpenseSum}>
                            {`(${budgetExpenseSum})`}
                        </Result>
                    )}
                </Description>
                <Description>
                    <Amount>{expenseSum}</Amount>
                </Description>
            </Content>

            <Content>
                <Description>
                    <Icon name="dollar-sign" type="result" />
                    <Title>Resultado</Title>
                    {isAfter(dateTransactions, new Date()) ? null : (
                        <Result result={budgetResultSum}>
                            {`(${budgetResultSum})`}
                        </Result>
                    )}
                </Description>
                <Description>
                    <Amount>{result}</Amount>
                </Description>
            </Content>
        </Container>
    );
}
