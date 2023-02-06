import React from "react";

import firestore from "@react-native-firebase/firestore";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { useAuth } from "../../hooks/auth";

import { ptBR } from "date-fns/locale";
import { Button } from "../../components/Forms/Button";
import { Container, Footer, Header, Title } from "./styles";

interface historyGraphicProps {
    quarter: number;
    period: string;
    entries: number;
    entriesFormatted: string;
    expenses: number;
    expensesFormatted: string;
    result: number;
    resultFormatted: string;
}

interface entryProps {
    period: string;
    date: string;
    amount: number;
    totalFormatted: string;
    entryType: string;
    type: string;
}

interface resultProps {
    period: string;
    date: string;
    amount: number;
    totalFormatted: string;
}

interface BudgetHistoryProps {
    transactionDate: Date;
    handleCloseBudgetHistory: () => void;
}

export function BudgetHistory({
    transactionDate,
    handleCloseBudgetHistory,
}: BudgetHistoryProps) {
    const { user } = useAuth();

    const [listPeriods, setListPeriods] = React.useState<string[]>([]);    

    function loadTransactions() {
        const sixMonthsToSelectedDate = subMonths(transactionDate, 5);
        firestore()
            .collection(`@EasyFlux:transactions_user:${user.id}`)
            .where("date", ">=", startOfMonth(sixMonthsToSelectedDate))
            .where("date", "<=", endOfMonth(transactionDate))
            .get()
            .then((transactions) => {
                const dataFormatted = transactions.docs.map((doc) => {
                    const {
                        amount,
                        category,
                        date,
                        entryType,
                        name,
                        period,
                        type,
                    } = doc.data();
                    return {
                        amount,
                        category,
                        date: new Date(date.toDate()),
                        entryType,
                        name,
                        period,
                        type,
                    };
                });

                const budgetRegisters = dataFormatted.filter(
                    (entry) => entry.entryType === "budget"
                );
                const actualsRegisters = dataFormatted.filter(
                    (entry) => entry.entryType === "actual"
                );

                let listOfPeriods: Date[] = [];
                for (var i = 0; i <= 5; i++) {
                    listOfPeriods.push(subMonths(transactionDate, i));
                }

                // Agrupamentos das entradas do budget
                const budgetEntriesRegisters: entryProps[] = [];
                listOfPeriods.forEach((period) => {
                    let datePeriod = format(new Date(period), "MMMM/yyyy", {
                        locale: ptBR,
                    });
                    let periodSum = 0;
                    let entryType = "budget";
                    let type = "positive";

                    budgetRegisters.forEach((entry) => {
                        entryType = entry.entryType;
                        type = entry.type;

                        if (
                            entry.period === datePeriod &&
                            entry.type === "positive"
                        ) {
                            periodSum += Number(entry.amount);
                        }
                    });

                    const totalFormatted = periodSum.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    });

                    budgetEntriesRegisters.push({
                        period: format(new Date(period), "MMM/yyyy", {
                            locale: ptBR,
                        }),
                        date: format(new Date(period), "MMMM/yyyy", {
                            locale: ptBR,
                        }),
                        amount: periodSum,
                        totalFormatted,
                        entryType,
                        type,
                    });
                });

                // Agrupamentos das saídas do budget
                const budgetExpensesRegisters: entryProps[] = [];
                listOfPeriods.forEach((period) => {
                    let datePeriod = format(new Date(period), "MMMM/yyyy", {
                        locale: ptBR,
                    });
                    let periodSum = 0;
                    let entryType = "budget";
                    let type = "negative";

                    budgetRegisters.forEach((entry) => {
                        entryType = entry.entryType;
                        type = entry.type;

                        if (
                            entry.period === datePeriod &&
                            entry.type === "negative"
                        ) {
                            periodSum += Number(entry.amount);
                        }
                    });

                    const totalFormatted = periodSum.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    });

                    budgetExpensesRegisters.push({
                        period: format(new Date(period), "MMM/yyyy", {
                            locale: ptBR,
                        }),
                        date: format(new Date(period), "MMMM/yyyy", {
                            locale: ptBR,
                        }),
                        amount: periodSum,
                        totalFormatted,
                        entryType,
                        type,
                    });
                });

                // Agrupamentos dos resultados do budget
                const budgetResultsRegisters: resultProps[] = [];
                listOfPeriods.forEach((period) => {
                    let datePeriod = format(new Date(period), "MMMM/yyyy", {
                        locale: ptBR,
                    });
                    let result = 0;

                    const amountBudgetEntry = budgetEntriesRegisters.filter(
                        (entry) => entry.date === datePeriod
                    )[0];

                    const amountBudgetExpense = budgetExpensesRegisters.filter(
                        (entry) => entry.date === datePeriod
                    )[0];

                    result =
                        amountBudgetEntry.amount - amountBudgetExpense.amount;

                    budgetResultsRegisters.push({
                        period: format(new Date(period), "MMM/yyyy", {
                            locale: ptBR,
                        }),
                        date: format(new Date(period), "MMMM/yyyy", {
                            locale: ptBR,
                        }),
                        amount: result,
                        totalFormatted: result.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        }),
                    });
                });

                const budgetHistory: historyGraphicProps[] = [];
                let quarter = 1;
                listOfPeriods.forEach((period) => {
                    let datePeriod = format(new Date(period), "MMMM/yyyy", {
                        locale: ptBR,
                    });

                    const amountBudgetEntry = budgetEntriesRegisters.filter(
                        (entry) => entry.date === datePeriod
                    )[0];

                    const amountBudgetExpense = budgetExpensesRegisters.filter(
                        (entry) => entry.date === datePeriod
                    )[0];

                    const resultBudget = budgetResultsRegisters.filter(
                        (entry) => entry.date === datePeriod
                    )[0];

                    budgetHistory.push({
                        quarter,
                        period: format(new Date(period), "MMM/yyyy", {
                            locale: ptBR,
                        }),
                        entries: amountBudgetEntry.amount,
                        entriesFormatted: amountBudgetEntry.totalFormatted,
                        expenses: amountBudgetExpense.amount,
                        expensesFormatted: amountBudgetExpense.totalFormatted,
                        result: resultBudget.amount,
                        resultFormatted: resultBudget.totalFormatted,
                    });
                    quarter += 1;
                });
                quarter = 0;

                // Agrupamentos das entradas do actuals
                const actualsEntriesRegisters: entryProps[] = [];
                listOfPeriods.forEach((period) => {
                    let datePeriod = format(new Date(period), "MMMM/yyyy", {
                        locale: ptBR,
                    });
                    let periodSum = 0;
                    let entryType = "actuals";
                    let type = "positive";

                    actualsRegisters.forEach((entry) => {
                        entryType = entry.entryType;
                        type = entry.type;

                        if (
                            entry.period === datePeriod &&
                            entry.type === "positive"
                        ) {
                            periodSum += Number(entry.amount);
                        }
                    });

                    const totalFormatted = periodSum.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    });

                    actualsEntriesRegisters.push({
                        period: format(new Date(period), "MMM/yyyy", {
                            locale: ptBR,
                        }),
                        date: format(new Date(period), "MMMM/yyyy", {
                            locale: ptBR,
                        }),
                        amount: periodSum,
                        totalFormatted,
                        entryType,
                        type,
                    });
                });

                // Agrupamentos das saídas do budget
                const actualsExpensesRegisters: entryProps[] = [];
                listOfPeriods.forEach((period) => {
                    let datePeriod = format(new Date(period), "MMMM/yyyy", {
                        locale: ptBR,
                    });
                    let periodSum = 0;
                    let entryType = "actual";
                    let type = "negative";

                    actualsRegisters.forEach((entry) => {
                        entryType = entry.entryType;
                        type = entry.type;

                        if (
                            entry.period === datePeriod &&
                            entry.type === "negative"
                        ) {
                            periodSum += Number(entry.amount);
                        }
                    });

                    const totalFormatted = periodSum.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    });

                    actualsExpensesRegisters.push({
                        period: format(new Date(period), "MMM/yyyy", {
                            locale: ptBR,
                        }),
                        date: format(new Date(period), "MMMM/yyyy", {
                            locale: ptBR,
                        }),
                        amount: periodSum,
                        totalFormatted,
                        entryType,
                        type,
                    });
                });

                // Agrupamentos dos resultados do actuals
                const actualResultsRegisters: resultProps[] = [];
                listOfPeriods.forEach((period) => {
                    let datePeriod = format(new Date(period), "MMMM/yyyy", {
                        locale: ptBR,
                    });
                    let result = 0;

                    const amountActualEntry = actualsEntriesRegisters.filter(
                        (entry) => entry.date === datePeriod
                    )[0];

                    const amountActualExpense = actualsExpensesRegisters.filter(
                        (entry) => entry.date === datePeriod
                    )[0];

                    result =
                        amountActualEntry.amount - amountActualExpense.amount;

                    actualResultsRegisters.push({
                        period: format(new Date(period), "MMM/yyyy", {
                            locale: ptBR,
                        }),
                        date: format(new Date(period), "MMMM/yyyy", {
                            locale: ptBR,
                        }),
                        amount: result,
                        totalFormatted: result.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        }),
                    });
                });

                const actualHistory: historyGraphicProps[] = [];
                quarter = 1;
                listOfPeriods.forEach((period) => {
                    let datePeriod = format(new Date(period), "MMMM/yyyy", {
                        locale: ptBR,
                    });

                    const amountActualEntry = actualsEntriesRegisters.filter(
                        (entry) => entry.date === datePeriod
                    )[0];

                    const amountActualExpense = actualsExpensesRegisters.filter(
                        (entry) => entry.date === datePeriod
                    )[0];

                    const resultActual = actualResultsRegisters.filter(
                        (entry) => entry.date === datePeriod
                    )[0];

                    actualHistory.push({
                        quarter,
                        period: format(new Date(period), "MMM/yyyy", {
                            locale: ptBR,
                        }),
                        entries: amountActualEntry.amount,
                        entriesFormatted: amountActualEntry.totalFormatted,
                        expenses: amountActualExpense.amount,
                        expensesFormatted: amountActualExpense.totalFormatted,
                        result: resultActual.amount,
                        resultFormatted: resultActual.totalFormatted,
                    });
                    quarter += 1;
                });

                const listOfDatesUniques: string[] = [];
                listOfPeriods.reverse();
                listOfPeriods.forEach((date) => {
                    listOfDatesUniques.push(
                        format(new Date(date), "MMM/yyyy", { locale: ptBR })
                    );
                });
                setListPeriods(listOfDatesUniques);
            });
    }

    React.useEffect(() => {
        loadTransactions()
    }, [])

    return (
        <Container>
            <Header>
                <Title>Histórico dos orçamentos</Title>
            </Header>
            <Footer>
                <Button title="Voltar" onPress={handleCloseBudgetHistory} />
            </Footer>
        </Container>
    );
}
