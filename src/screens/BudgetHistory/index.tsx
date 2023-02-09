import React from "react";
import { ActivityIndicator } from "react-native";

import firestore from "@react-native-firebase/firestore";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { useAuth } from "../../hooks/auth";

import { ptBR } from "date-fns/locale";
import {
    VictoryAxis,
    VictoryBar,
    VictoryChart,
    VictoryGroup
} from "victory-native";
import { Button } from "../../components/Forms/Button";

import theme from "../../global/styles/theme";
import {
    CellTable,
    CellWrapper,
    Container,
    Description,
    DescriptionHeaderCell,
    DescriptionResult,
    DisplayData,
    Footer,
    Header,
    HeaderTable,
    HeaderWrapper,
    HistoryContainer,
    LoadContainer,
    Title,
    TitleGraph
} from "./styles";

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

    const [isLoading, setIsLoading] = React.useState(true);
    const [listPeriods, setListPeriods] = React.useState<string[]>([]);
    const [budget, setBudget] = React.useState<historyGraphicProps[]>([]);
    const [actuals, setActuals] = React.useState<historyGraphicProps[]>([]);

    function searchActualPeriod(period: string, type: string) {
        const actual = actuals.filter((item) => item.period === period)[0];
        let typeRegister = 0;

        if (type === "entries") {
            typeRegister = actual.entries;
        } else if (type === "expenses") {
            typeRegister = actual.expenses;
        } else {
            typeRegister = actual.result;
        }

        if (actual) {
            const actualFormatted = Number(typeRegister).toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL",
                }
            );
            return actualFormatted;
        } else {
            return "R$0,00";
        }
    }

    function calculateResult(period: string, type: string) {
        const budgetRow = budget.filter((item) => item.period === period)[0];
        const actualRow = actuals.filter((item) => item.period === period)[0];
        let typeRegisterBudget = 0;
        let typeRegisterActual = 0;

        if (type === "entries") {
            typeRegisterBudget = budgetRow.entries;
            typeRegisterActual = actualRow.entries;
        } else if (type === "expenses") {
            typeRegisterBudget = budgetRow.expenses;
            typeRegisterActual = actualRow.expenses;
        } else {
            typeRegisterBudget = budgetRow.result;
            typeRegisterActual = actualRow.result;
        }

        if (budgetRow) {
            if (type === "entries") {
                const result =
                    Number(typeRegisterActual) - Number(typeRegisterBudget);
                return result.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                });
            } else if (type === "expenses") {
                const result =
                    Number(typeRegisterBudget) - Number(typeRegisterActual);
                return result.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                });
            } else {
                const result =
                    Number(typeRegisterActual) - Number(typeRegisterBudget);
                return result.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                });
            }
        }
    }

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
                listOfPeriods.reverse();

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
                listOfPeriods.forEach((date) => {
                    listOfDatesUniques.push(
                        format(new Date(date), "MMM/yyyy", { locale: ptBR })
                    );
                });
                setListPeriods(listOfDatesUniques);
                setBudget(budgetHistory);
                setActuals(actualHistory);
                setIsLoading(false);
            });
    }

    React.useEffect(() => {
        loadTransactions();
    }, []);

    return (
        <Container>
            <Header>
                <Title>Histórico dos orçamentos</Title>
            </Header>
            {isLoading ? (
                <LoadContainer>
                    <ActivityIndicator
                        size={"large"}
                        color={theme.colors.primary}
                    />
                </LoadContainer>
            ) : (
                <HistoryContainer>
                    <DisplayData>
                        <TitleGraph>
                            Entradas: Orçamento vs Realizado
                        </TitleGraph>
                        <VictoryChart
                            width={380}
                            domainPadding={24}
                            animate={{
                                duration: 1000,
                                onLoad: { duration: 1000 },
                            }}
                            padding={{
                                left: 20,
                                right: 20,
                                bottom: 40,
                                top: 20,
                            }}
                        >
                            <VictoryGroup
                                offset={22}
                                colorScale={["#510793", "#9e5dd6"]}
                                width={380}
                            >
                                <VictoryBar
                                    barWidth={20}
                                    cornerRadius={3}
                                    alignment={"middle"}
                                    data={budget}
                                    x="period"
                                    y="entries"
                                    labels={({ datum }) =>
                                        datum.entries > 0
                                            ? `${datum.entriesFormatted}`
                                            : ""
                                    }
                                    style={{
                                        labels: {
                                            fontSize: 9,
                                        },
                                    }}
                                />
                                <VictoryBar
                                    barWidth={20}
                                    cornerRadius={3}
                                    alignment={"middle"}
                                    data={actuals}
                                    x="period"
                                    y="entries"
                                    labels={({ datum }) =>
                                        datum.entries > 0
                                            ? `${datum.entriesFormatted}`
                                            : ""
                                    }
                                    style={{
                                        labels: {
                                            fontSize: 9,
                                        },
                                    }}
                                />
                            </VictoryGroup>
                            <VictoryAxis
                                orientation="bottom"
                                width={380}
                                tickValues={[1, 2, 3, 4, 5, 6]}
                                tickFormat={listPeriods}
                                style={{ tickLabels: { fontSize: 10 } }}
                            />
                        </VictoryChart>

                        <HeaderWrapper>
                            <HeaderTable color="#510793">
                                <DescriptionHeaderCell>
                                    Período
                                </DescriptionHeaderCell>
                                <DescriptionHeaderCell>
                                    Orçamento
                                </DescriptionHeaderCell>
                                <DescriptionHeaderCell>
                                    Realizado
                                </DescriptionHeaderCell>
                                <DescriptionHeaderCell>
                                    Diferença
                                </DescriptionHeaderCell>
                            </HeaderTable>
                        </HeaderWrapper>
                        <CellWrapper>
                            {budget.map((entry) => {
                                return (
                                    <CellTable key={entry.period}>
                                        <Description>
                                            {entry.period}
                                        </Description>
                                        <Description>
                                            {entry.entriesFormatted}
                                        </Description>
                                        <Description>
                                            {searchActualPeriod(
                                                entry.period,
                                                "entries"
                                            )}
                                        </Description>
                                        <DescriptionResult
                                            amount={calculateResult(
                                                entry.period,
                                                "entries"
                                            )}
                                        >
                                            {calculateResult(
                                                entry.period,
                                                "entries"
                                            )}
                                        </DescriptionResult>
                                    </CellTable>
                                );
                            })}
                        </CellWrapper>

                        <TitleGraph>Saídas: Orçamento vs Realizado</TitleGraph>
                        <VictoryChart
                            width={380}
                            domainPadding={24}
                            animate={{
                                duration: 1000,
                                onLoad: { duration: 1000 },
                            }}
                            padding={{
                                left: 20,
                                right: 20,
                                bottom: 40,
                                top: 20,
                            }}
                        >
                            <VictoryGroup
                                offset={22}
                                colorScale={["#ff1616", "#fd756b"]}
                                width={380}
                            >
                                <VictoryBar
                                    barWidth={20}
                                    cornerRadius={3}
                                    alignment={"middle"}
                                    data={budget}
                                    x="period"
                                    y="expenses"
                                    labels={({ datum }) =>
                                        datum.expenses > 0
                                            ? `${datum.expensesFormatted}`
                                            : ""
                                    }
                                    style={{
                                        labels: {
                                            fontSize: 9,
                                        },
                                    }}
                                />
                                <VictoryBar
                                    barWidth={20}
                                    cornerRadius={3}
                                    alignment={"middle"}
                                    data={actuals}
                                    x="period"
                                    y="expenses"
                                    labels={({ datum }) =>
                                        datum.expenses > 0
                                            ? `${datum.expensesFormatted}`
                                            : ""
                                    }
                                    style={{
                                        labels: {
                                            fontSize: 9,
                                        },
                                    }}
                                />
                            </VictoryGroup>
                            <VictoryAxis
                                orientation="bottom"
                                width={380}
                                tickValues={[1, 2, 3, 4, 5, 6]}
                                tickFormat={listPeriods}
                                style={{ tickLabels: { fontSize: 10 } }}
                            />
                        </VictoryChart>
                        <HeaderWrapper>
                            <HeaderTable color="#ff1616">
                                <DescriptionHeaderCell>
                                    Período
                                </DescriptionHeaderCell>
                                <DescriptionHeaderCell>
                                    Orçamento
                                </DescriptionHeaderCell>
                                <DescriptionHeaderCell>
                                    Realizado
                                </DescriptionHeaderCell>
                                <DescriptionHeaderCell>
                                    Diferença
                                </DescriptionHeaderCell>
                            </HeaderTable>
                        </HeaderWrapper>
                        <CellWrapper>
                            {budget.map((entry) => {
                                return (
                                    <CellTable key={entry.period}>
                                        <Description>
                                            {entry.period}
                                        </Description>
                                        <Description>
                                            {entry.expensesFormatted}
                                        </Description>
                                        <Description>
                                            {searchActualPeriod(
                                                entry.period,
                                                "expenses"
                                            )}
                                        </Description>
                                        <DescriptionResult
                                            amount={calculateResult(
                                                entry.period,
                                                "expenses"
                                            )}
                                        >
                                            {calculateResult(
                                                entry.period,
                                                "expenses"
                                            )}
                                        </DescriptionResult>
                                    </CellTable>
                                );
                            })}
                        </CellWrapper>

                        <TitleGraph>
                            Resultado: Orçamento vs Realizado
                        </TitleGraph>
                        <VictoryChart
                            width={380}
                            domainPadding={24}
                            animate={{
                                duration: 1000,
                                onLoad: { duration: 1000 },
                            }}
                            padding={{
                                left: 20,
                                right: 20,
                                bottom: 40,
                                top: 20,
                            }}
                        >
                            <VictoryGroup
                                offset={22}
                                colorScale={["#226f09", "#70c553"]}
                                width={380}
                            >
                                <VictoryBar
                                    barWidth={20}
                                    cornerRadius={3}
                                    alignment={"middle"}
                                    data={budget}
                                    x="period"
                                    y="result"
                                    labels={({ datum }) =>
                                        datum.result > 0
                                            ? `${datum.resultFormatted}`
                                            : datum.result === 0
                                            ? ""
                                            : `${datum.resultFormatted}`
                                    }
                                    style={{
                                        labels: {
                                            fontSize: 9,
                                        },
                                        data: {
                                            fill: ({ datum }) =>
                                                datum.result > 0
                                                    ? "#226f09"
                                                    : "#ff1616",
                                        },
                                    }}
                                />
                                <VictoryBar
                                    barWidth={20}
                                    cornerRadius={3}
                                    alignment={"middle"}
                                    data={actuals}
                                    x="period"
                                    y="result"
                                    labels={({ datum }) =>
                                        datum.result > 0
                                            ? `${datum.resultFormatted}`
                                            : datum.result === 0
                                            ? ""
                                            : `${datum.resultFormatted}`
                                    }
                                    style={{
                                        labels: {
                                            fontSize: 9,
                                        },
                                        data: {
                                            fill: ({ datum }) =>
                                                datum.result > 0
                                                    ? "#70c553"
                                                    : "#fd756b",
                                        },
                                    }}
                                />
                            </VictoryGroup>
                            <VictoryAxis
                                orientation="bottom"
                                width={380}
                                tickValues={[1, 2, 3, 4, 5, 6]}
                                tickFormat={listPeriods}
                                style={{ tickLabels: { fontSize: 10 } }}
                            />
                        </VictoryChart>
                        <HeaderWrapper>
                            <HeaderTable color="#226f09">
                                <DescriptionHeaderCell>
                                    Período
                                </DescriptionHeaderCell>
                                <DescriptionHeaderCell>
                                    Orçamento
                                </DescriptionHeaderCell>
                                <DescriptionHeaderCell>
                                    Realizado
                                </DescriptionHeaderCell>
                                <DescriptionHeaderCell>
                                    Diferença
                                </DescriptionHeaderCell>
                            </HeaderTable>
                        </HeaderWrapper>
                        <CellWrapper>
                            {budget.map((entry) => {
                                return (
                                    <CellTable key={entry.period}>
                                        <Description>
                                            {entry.period}
                                        </Description>
                                        <Description>
                                            {entry.resultFormatted}
                                        </Description>
                                        <Description>
                                            {searchActualPeriod(
                                                entry.period,
                                                "result"
                                            )}
                                        </Description>
                                        <DescriptionResult
                                            amount={calculateResult(
                                                entry.period,
                                                "result"
                                            )}
                                        >
                                            {calculateResult(
                                                entry.period,
                                                "result"
                                            )}
                                        </DescriptionResult>
                                    </CellTable>
                                );
                            })}
                        </CellWrapper>
                    </DisplayData>
                </HistoryContainer>
            )}

            <Footer>
                <Button title="Voltar" onPress={handleCloseBudgetHistory} />
            </Footer>
        </Container>
    );
}
