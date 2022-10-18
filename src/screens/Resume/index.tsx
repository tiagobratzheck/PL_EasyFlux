import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { ActivityIndicator } from "react-native";
import { HistoryCard } from "../../components/HistoryCard";
import { categoriesOutcome } from "../../utils/categories";

import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../hooks/auth";

import { useTheme } from "styled-components";

import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { addMonths, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer,
} from "./styles";

interface TransactionData {
    id: string;
    entryType: "actual" | "budget";
    type: "positive" | "negative";
    name: string;
    amount: string;
    category: string;
    date: string;
    period: string;
}

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export function Resume() {
    const [totalByCategories, setTotalByCategories] = React.useState<
        CategoryData[]
    >([]);
    const { user } = useAuth();

    const [selectedDate, setSelectedDate] = React.useState(new Date());

    const [isLoading, setIsLoading] = React.useState(false);

    const theme = useTheme();

    function handleDateChange(action: "next" | "prev") {
        if (action === "next") {
            const newDate = addMonths(selectedDate, 1);
            setSelectedDate(newDate);
        } else {
            const newDate = subMonths(selectedDate, 1);
            setSelectedDate(newDate);
        }
    }

    async function loadData() {
        setIsLoading(true);
        const dataKey = `@EasyFlux:transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expenses = responseFormatted.filter(
            (expense: TransactionData) =>
                expense.type === "negative" &&
                new Date(expense.date).getMonth() === selectedDate.getMonth() &&
                new Date(expense.date).getFullYear() ===
                    selectedDate.getFullYear()
        );

        const expensesTotal = expenses.reduce(
            (acumullator: number, expense: TransactionData) => {
                return acumullator + Number(expense.amount);
            },
            0
        );

        const totalByCategory: CategoryData[] = [];

        categoriesOutcome.forEach((category) => {
            let categorySum = 0;
            expenses.forEach((expense: TransactionData) => {
                if (expense.category === category.key) {
                    categorySum += Number(expense.amount);
                }
            });

            if (categorySum > 0) {
                const totalFormatted = categorySum.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                });

                const percent = `${(
                    (categorySum / expensesTotal) *
                    100
                ).toFixed(2)}%`;

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total: categorySum,
                    totalFormatted,
                    percent,
                });
            }
        });
        totalByCategory.sort((a, b) =>
            a.total < b.total ? 1 : b.total < a.total ? -1 : 0
        );
        setTotalByCategories(totalByCategory);
        setIsLoading(false);
    }

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [selectedDate])
    );

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>
            {isLoading ? (
                <LoadContainer>
                    <ActivityIndicator
                        size={"large"}
                        color={theme.colors.primary}
                    />
                </LoadContainer>
            ) : (
                <Content
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingBottom: useBottomTabBarHeight(),
                    }}
                >
                    <MonthSelect>
                        <MonthSelectButton
                            onPress={() => handleDateChange("prev")}
                        >
                            <MonthSelectIcon name="chevron-left" />
                        </MonthSelectButton>
                        <Month>
                            {format(selectedDate, "MMMM, yyyy", {
                                locale: ptBR,
                            })}
                        </Month>
                        <MonthSelectButton
                            onPress={() => handleDateChange("next")}
                        >
                            <MonthSelectIcon name="chevron-right" />
                        </MonthSelectButton>
                    </MonthSelect>

                    <ChartContainer>
                        <VictoryPie
                            data={totalByCategories}
                            colorScale={totalByCategories.map(
                                (category) => category.color
                            )}
                            style={{
                                labels: {
                                    fontSize: RFValue(11),
                                    fontWeight: "bold",
                                    fill: theme.colors.text,
                                },
                            }}
                            padAngle={2}
                            innerRadius={100}
                            height={380}
                            labelRadius={150}
                            x="percent"
                            y="total"
                        />
                    </ChartContainer>
                    {totalByCategories.map((item) => {
                        return (
                            <HistoryCard
                                key={item.key}
                                title={item.name}
                                amount={item.totalFormatted}
                                color={item.color}
                            />
                        );
                    })}
                </Content>
            )}
        </Container>
    );
}
