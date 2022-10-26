import React from "react";
import { ActivityIndicator } from "react-native";

import { Button } from "../../components/Forms/Button";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

import firestore from "@react-native-firebase/firestore";

import {
    VictoryChart,
    VictoryLine,
    VictoryAxis,
    VictoryBar,
} from "victory-native";

import {
    Container,
    Header,
    Title,
    Footer,
    LoadContainer,
    Content,
    CategoryInformation,
    Icon,
    CategoryName,
} from "./styles";
import theme from "../../global/styles/theme";
import { commonCategories } from "../../utils/categories";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

interface TransactionProps {
    entryType: "actual" | "budget";
    name: string;
    amount: string;
    category: string;
    date: string;
    period: string;
    type: "positive" | "negative";
}

interface TotalByPeriodProps {
    quarter: number;
    entryType: string;
    name: string;
    amount: number;
    totalFormatted: string;
    category: string;
    period: string;
}

interface Category {
    key: string;
    name: string;
    icon: string;
    color: string;
}

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
    const [isLoading, setIsLoading] = React.useState(true);

    const [actualTransactions, setActualTransactions] = React.useState<
        TotalByPeriodProps[]
    >([]);

    const [budgetTransactions, setBudgetTransactions] = React.useState<
        TransactionProps[]
    >([]);

    const [listPeriods, setListPeriods] = React.useState<string[]>([]);

    const [categoryProperties, setCategoryProperties] =
        React.useState<Category>({} as Category);

    function loadTransactions() {
        const sixMonthsToSelectedDate = subMonths(selectedDate, 5);
        let listOfPeriodsSelected: string[] = [];
        firestore()
            .collection("@EasyFlux:transactions_user:2547789544")
            .where("category", "==", category)
            .where("date", ">=", sixMonthsToSelectedDate)
            .where("date", "<=", selectedDate)
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
                        date: new Date(date.toDate()).toDateString(),
                        entryType,
                        name,
                        period,
                        type,
                    };
                });

                let listOfPeriods: string[] = [];
                dataFormatted.map((doc) => {
                    listOfPeriods.push(doc.period);
                });

                listOfPeriodsSelected = listOfPeriods.filter(
                    (element, index) => {
                        return listOfPeriods.indexOf(element) === index;
                    }
                );

                const dataActualFormatted = dataFormatted.filter(
                    (entry) => entry.entryType === "actual"
                );

                const totalBudgetByPeriod: TransactionProps[] =
                    dataFormatted.filter(
                        (entry) => entry.entryType === "budget"
                    );

                const totalByPeriod: TotalByPeriodProps[] = [];
                let quarter = 0;

                listOfPeriodsSelected.forEach((period) => {
                    let periodSum = 0;
                    let entryType = "";
                    let name = "";
                    let category = "";

                    quarter += 1;

                    dataActualFormatted.forEach((entry) => {
                        if (period === entry.period) {
                            periodSum += Number(entry.amount);
                            entryType = entry.entryType;
                            name = entry.name;
                            category = entry.category;
                        }
                    });

                    if (periodSum > 0) {
                        const totalFormatted = periodSum.toLocaleString(
                            "pt-BR",
                            {
                                style: "currency",
                                currency: "BRL",
                            }
                        );

                        totalByPeriod.push({
                            category,
                            name,
                            quarter,
                            period,
                            amount: periodSum,
                            totalFormatted,
                            entryType,
                        });
                    }
                });

                const listOfDates: string[] = [];
                const listOfDatesFormatted: string[] = [];
                let listOfDatesUniques: string[] = [];

                dataFormatted.map((doc) => {
                    listOfDates.push(doc.date);
                });

                listOfDates.forEach((date) => {
                    listOfDatesFormatted.push(
                        format(new Date(date), "MMM/yyyy", { locale: ptBR })
                    );
                });

                listOfDatesUniques = listOfDatesFormatted.filter(
                    (element, index) => {
                        return listOfDatesFormatted.indexOf(element) === index;
                    }
                );

                setListPeriods(listOfDatesUniques);

                if (totalByPeriod.length > 0) {
                    setActualTransactions(totalByPeriod);
                }

                if (totalBudgetByPeriod.length > 0) {
                    setBudgetTransactions(totalBudgetByPeriod);
                }

                const categoryProps = commonCategories.filter(
                    (item) => item.key === category
                )[0];
                setCategoryProperties(categoryProps);

                setIsLoading(false);
            });
    }

    React.useEffect(() => {
        loadTransactions();
    }, []);

    return (
        <Container>
            <Header>
                <Title>Histórico</Title>
            </Header>
            <Content
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: useBottomTabBarHeight(),
                }}
            >
                {isLoading ? (
                    <LoadContainer>
                        <ActivityIndicator
                            size={"large"}
                            color={theme.colors.primary}
                        />
                    </LoadContainer>
                ) : (
                    <>
                        <CategoryInformation>
                            <Icon name={categoryProperties.icon} />
                            <CategoryName>
                                {categoryProperties.name}
                            </CategoryName>
                        </CategoryInformation>
                        <VictoryChart
                            width={400}
                            domainPadding={30}
                            padding={30}
                        >
                            <VictoryBar
                                barRatio={0.7}
                                alignment={"middle"}
                                data={actualTransactions}
                                x="quarter"
                                y="amount"
                                labels={({ datum }) =>
                                    `${datum.totalFormatted}`
                                }
                                style={{
                                    data: { fill: categoryProperties.color },
                                    labels: {
                                        fontSize: 13,
                                    },
                                }}
                                padding={{ top: 20, bottom: 60 }}
                            />

                            <VictoryAxis
                                orientation="bottom"
                                width={400}
                                tickFormat={listPeriods}
                                style={{ tickLabels: { fontSize: 11 } }}
                            />
                        </VictoryChart>
                    </>
                )}
            </Content>

            <Footer>
                <Button title="Voltar" onPress={closeHistoryAccount}></Button>
            </Footer>
        </Container>
    );
}
