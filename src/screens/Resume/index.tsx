import React from "react";
import { ActivityIndicator, Modal } from "react-native";
import { HistoryCard } from "../../components/HistoryCard";
import { commonCategories } from "../../utils/categories";

import { useAuth } from "../../hooks/auth";
import { useDate } from "../../hooks/date";

import { useTheme } from "styled-components";

import { VictoryPie } from "victory-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { addMonths, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

import firestore from "@react-native-firebase/firestore";

import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";

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
    Form,
    TransactionsTypes,
} from "./styles";
import { HistoryAccount } from "../HistoryAccount";

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
    const [transactionType, setTransactionType] = React.useState("positive");
    const [totalByCategories, setTotalByCategories] = React.useState<
        CategoryData[]
    >([]);
    const [categoryModalOpen, setCategoryModalOpen] = React.useState(false);
    const [categoryKey, setCategoryKey] = React.useState("");

    const { user } = useAuth();
    const { dateTransactions, changeDateTransactions } = useDate();

    const [isLoading, setIsLoading] = React.useState(false);

    const theme = useTheme();

    function handleTransactionsType(type: "positive" | "negative") {
        setTransactionType(type);
    }

    function handleCloseSelectCategory() {
        setCategoryModalOpen(false);
    }

    function handleOpenSelectCategory() {
        setCategoryModalOpen(true);
    }

    function loadData() {
        setIsLoading(true);
        firestore()
            .collection(`@EasyFlux:transactions_user:${user.id}`)
            .where("entryType", "==", "actual")
            .where("type", "==", transactionType)
            .where(
                "period",
                "==",
                format(dateTransactions, "MMMM/yyyy", { locale: ptBR })
            )
            .onSnapshot((snapshot) => {
                const dataTransformed: TransactionData[] = snapshot.docs.map(
                    (doc) => {
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
                            id: doc.id,
                            amount,
                            category,
                            date: new Date(date.toDate()).toDateString(),
                            entryType,
                            name,
                            period,
                            type,
                        };
                    }
                );

                const totalEntries = dataTransformed.filter(
                    (entry: TransactionData) =>
                        new Date(entry.date).getMonth() ===
                            dateTransactions.getMonth() &&
                        new Date(entry.date).getFullYear() ===
                            dateTransactions.getFullYear()
                );

                const sumEntries = totalEntries.reduce(
                    (acumullator: number, entry: TransactionData) => {
                        return acumullator + Number(entry.amount);
                    },
                    0
                );

                const totalByCategory: CategoryData[] = [];

                commonCategories.forEach((category) => {
                    let categorySum = 0;
                    totalEntries.forEach((entry: TransactionData) => {
                        if (entry.category === category.key) {
                            categorySum += Number(entry.amount);
                        }
                    });

                    if (categorySum > 0) {
                        const totalFormatted = categorySum.toLocaleString(
                            "pt-BR",
                            {
                                style: "currency",
                                currency: "BRL",
                            }
                        );

                        const percent = `${(
                            (categorySum / sumEntries) *
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
            });
    }

    function handleHistoryAccounts(category: string) {
        setCategoryKey(category);
        handleOpenSelectCategory();
    }

    React.useEffect(() => {
        const subscriber = loadData();

        return subscriber;
    }, [dateTransactions, transactionType]);

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
                <>
                    <MonthSelect>
                        <MonthSelectButton
                            onPress={() => changeDateTransactions("prev")}
                        >
                            <MonthSelectIcon name="chevron-left" />
                        </MonthSelectButton>
                        <Month>
                            {format(dateTransactions, "MMMM, yyyy", {
                                locale: ptBR,
                            })}
                        </Month>
                        <MonthSelectButton
                            onPress={() => changeDateTransactions("next")}
                        >
                            <MonthSelectIcon name="chevron-right" />
                        </MonthSelectButton>
                    </MonthSelect>
                    <Form>
                        <TransactionsTypes>
                            <TransactionTypeButton
                                type="up"
                                title="Entrada"
                                onPress={() => {
                                    handleTransactionsType("positive");
                                }}
                                isActive={transactionType === "positive"}
                            />
                            <TransactionTypeButton
                                type="down"
                                title="Saída"
                                onPress={() => {
                                    handleTransactionsType("negative");
                                }}
                                isActive={transactionType === "negative"}
                            />
                        </TransactionsTypes>
                    </Form>
                    <Content
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            paddingBottom: useBottomTabBarHeight(),
                        }}
                    >
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
                                    onPress={() => {
                                        handleHistoryAccounts(item.key);
                                    }}
                                    key={item.key}
                                    title={item.name}
                                    amount={item.totalFormatted}
                                    color={item.color}
                                />
                            );
                        })}
                    </Content>
                </>
            )}
            <Modal visible={categoryModalOpen}>
                <HistoryAccount
                    category={categoryKey}
                    selectedDate={dateTransactions}
                    closeHistoryAccount={handleCloseSelectCategory}
                />
            </Modal>
        </Container>
    );
}
