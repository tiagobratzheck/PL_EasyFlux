import React from "react";
import { ActivityIndicator } from "react-native";

import firestore from "@react-native-firebase/firestore";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useTheme } from "styled-components";

import { FlatList } from "react-native";
import { getBottomSpace } from "react-native-iphone-x-helper";

import { HighlightCard } from "../../components/HighlightCard";
import {
    TransactionCard,
    TransactionCardProps,
} from "../../components/TransactionCard";

import { useAuth } from "../../hooks/auth";
import { useDate } from "../../hooks/date";

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

export interface DataListProps extends TransactionCardProps {}

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

    const theme = useTheme();
    const { user, signOut } = useAuth();
    const { dateTransactions, changeDateTransactions } = useDate();

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

    function loadTransactions() {
        firestore()
            .collection(`@EasyFlux:transactions_user:${user.id}`)
            .where("entryType", "==", "actual")
            .where(
                "period",
                "==",
                format(dateTransactions, "MMMM/yyyy", { locale: ptBR })
            )
            .onSnapshot((snapshot) => {
                let entriesSum = 0;
                let expensesSum = 0;

                const dataTransformed = snapshot.docs.map((doc) => {
                    const {
                        amount,
                        category,
                        date,
                        entryType,
                        name,
                        period,
                        type,
                    } = doc.data();

                    if (type === "positive") {
                        entriesSum += Number(amount);
                    } else {
                        expensesSum += Number(amount);
                    }

                    const amountFormatted = Number(amount).toLocaleString(
                        "pt-BR",
                        {
                            style: "currency",
                            currency: "BRL",
                        }
                    );

                    return {
                        id: doc.id,
                        amount: amountFormatted,
                        category,
                        date: new Date(date.toDate()).toDateString(),
                        entryType,
                        name,
                        period,
                        type,
                    };
                });
                setData(dataTransformed);

                const lastTransactionEntries = getLastTransactionDate(
                    dataTransformed,
                    "positive"
                );
                const lastTransactionExpenses = getLastTransactionDate(
                    dataTransformed,
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
            });
    }

    React.useEffect(() => {
        const subscriber = loadTransactions();

        return subscriber;
    }, [dateTransactions]);

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
                                    selectedDate={dateTransactions}
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
