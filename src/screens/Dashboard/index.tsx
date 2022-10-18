import React from "react";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import firestore from "@react-native-firebase/firestore";

import { addMonths, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components";

import { FlatList } from "react-native";
import { getBottomSpace } from "react-native-iphone-x-helper";

import { HighlightCard } from "../../components/HighlightCard";
import {
    TransactionCard,
    TransactionCardProps,
} from "../../components/TransactionCard";

import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    LogoutButton,
    LoadContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
} from "./styles";
import { useAuth } from "../../hooks/auth";

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighLightProps {
    amount: string;
    lastTransaction: string;
}

interface HighLightData {
    entries: HighLightProps;
    expenses: HighLightProps;
    total: HighLightProps;
}

export function Dashboard() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState<DataListProps[]>([]);
    const [highLightData, setHighLightData] = React.useState<HighLightData>(
        {} as HighLightData
    );
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const theme = useTheme();
    const { user, signOut } = useAuth();

    function getLastTransactionDate(
        collection: DataListProps[],
        type: "positive" | "negative"
    ) {
        const collectionFilttered = collection.filter(
            (transaction) => transaction.type === type
        );

        if (collectionFilttered.length === 0) {
            return 0;
        }

        const lastTransaction = new Date(
            Math.max.apply(
                Math,
                collectionFilttered.map((transaction) =>
                    new Date(transaction.date).getTime()
                )
            )
        );
        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
            "pt-BR",
            { month: "long" }
        )}`;
    }

    function handleDateChange(action: "next" | "prev") {
        if (action === "next") {
            const newDate = addMonths(selectedDate, 1);
            setSelectedDate(newDate);
        } else {
            const newDate = subMonths(selectedDate, 1);
            setSelectedDate(newDate);
        }
    }

    async function loadTransactions() {
        const dataKey = `@EasyFlux:transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesSum = 0;
        let expensesSum = 0;

        const transactionsFormatted: DataListProps[] = transactions.map(
            (item: DataListProps) => {
                if (item.type === "positive") {
                    entriesSum += Number(item.amount);
                } else {
                    expensesSum += Number(item.amount);
                }

                const amount = Number(item.amount).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                });
                const date = Intl.DateTimeFormat("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                }).format(new Date(item.date));

                return {
                    id: item.id,
                    entryType: item.entryType,
                    name: item.name,
                    amount,
                    type: item.type,
                    category: item.category,
                    date,
                    period: item.period,
                };
            }
        );
        setData(transactionsFormatted);

        const lastTransactionEntries = getLastTransactionDate(
            transactions,
            "positive"
        );
        const lastTransactionExpenses = getLastTransactionDate(
            transactions,
            "negative"
        );
        const totalInterval =
            lastTransactionExpenses !== 0
                ? `01 a ${lastTransactionExpenses}`
                : lastTransactionEntries !== 0
                ? `01 a ${lastTransactionEntries}`
                : "Sem lançamentos";

        const total = entriesSum - expensesSum;

        setHighLightData({
            entries: {
                amount: entriesSum.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }),
                lastTransaction:
                    lastTransactionEntries === 0
                        ? "Sem lançamentos para o período "
                        : `Última entrada dia ${lastTransactionEntries}`,
            },
            expenses: {
                amount: expensesSum.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }),
                lastTransaction:
                    lastTransactionExpenses === 0
                        ? "Sem lançamentos para o período "
                        : `Última saída dia ${lastTransactionExpenses}`,
            },
            total: {
                amount: total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }),
                lastTransaction: totalInterval,
            },
        });

        setIsLoading(false);
    }

    React.useEffect(() => {
        const subscriber = firestore()
            .collection("@EasyFlux:transactions_user:2547789544")
            .where("entryType", "==", "actual")
            .where(
                "period",
                "==",
                format(selectedDate, "MMMM/yyyy", { locale: ptBR })
            )
            .onSnapshot((snapshot) => {
                const data = snapshot.docs.map((doc) => {
                    const {
                        amount,
                        category,
                        date,
                        entryType,
                        name,
                        period,
                        type,
                    } = doc.data();

                    const dateFormatted = Intl.DateTimeFormat("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                    }).format(new Date(date.toDate()));

                    return {
                        id: doc.id,
                        amount,
                        category,
                        dateFormatted,
                        entryType,
                        name,
                        period,
                        type,
                    };
                });
            });

        return subscriber;
    }, [selectedDate]);

    useFocusEffect(
        React.useCallback(() => {
            loadTransactions();
        }, [])
    );

    return (
        <Container>
            {isLoading ? (
                <LoadContainer>
                    <ActivityIndicator
                        size={"large"}
                        color={theme.colors.primary}
                    />
                </LoadContainer>
            ) : (
                <>
                    <Header>
                        <UserWrapper>
                            <UserInfo>
                                <Photo
                                    source={{
                                        uri: user.photo,
                                    }}
                                />
                                <User>
                                    <UserGreeting>Olá!</UserGreeting>
                                    <UserName>{user.name}</UserName>
                                </User>
                            </UserInfo>
                            <LogoutButton onPress={signOut}>
                                <Icon name="log-out" />
                            </LogoutButton>
                        </UserWrapper>
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
                    </Header>

                    <HighlightCards>
                        <HighlightCard
                            type="up"
                            title="Entradas"
                            amount={highLightData.entries.amount}
                            lastTransaction={
                                highLightData.entries.lastTransaction
                            }
                        />
                        <HighlightCard
                            type="down"
                            title="Saídas"
                            amount={highLightData.expenses.amount}
                            lastTransaction={
                                highLightData.expenses.lastTransaction
                            }
                        />
                        <HighlightCard
                            type="total"
                            title="Total"
                            amount={highLightData.total.amount}
                            lastTransaction={
                                highLightData.total.lastTransaction
                            }
                        />
                    </HighlightCards>
                    <Transactions>
                        <Title>Listagem</Title>
                        <FlatList
                            data={data}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TransactionCard
                                    data={item}
                                    selectedDate={selectedDate}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingBottom: getBottomSpace(),
                            }}
                        />
                    </Transactions>
                </>
            )}
        </Container>
    );
}
