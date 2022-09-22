import React from "react";
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
} from "./styles";

export interface DataListProps extends TransactionCardProps {
    id: string;
}

export function Dashboard() {
    const data: DataListProps[] = [
        {
            id: "1",
            type: "positive",
            title: "Remuneração",
            amount: "R$ 3.980,59",
            category: {
                name: "Salário",
                icon: "dollar-sign",
            },
            date: "15/08/2022",
        },
        {
            id: "2",
            type: "negative",
            title: "Compras Muffato",
            amount: "R$ 321,58",
            category: {
                name: "Alimentação",
                icon: "coffee",
            },
            date: "15/08/2022",
        },
        {
            id: "3",
            type: "negative",
            title: "Aluguel da casa",
            amount: "R$ 1650,00",
            category: {
                name: "Aluguel",
                icon: "shopping-bag",
            },
            date: "15/08/2022",
        },
    ];

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo
                            source={{
                                uri: "https://avatars.githubusercontent.com/u/44751489?v=4",
                            }}
                        />
                        <User>
                            <UserGreeting>Olá!</UserGreeting>
                            <UserName>Tiago</UserName>
                        </User>
                    </UserInfo>
                    <LogoutButton onPress={() => {}}>
                        <Icon name="log-out" />
                    </LogoutButton>
                </UserWrapper>
            </Header>
            <HighlightCards>
                <HighlightCard
                    type="up"
                    title="Entradas"
                    amount="R$ 8.635,59"
                    lastTransaction="Último lançamento dia 19 de setembro"
                />
                <HighlightCard
                    type="down"
                    title="Saídas"
                    amount="R$ 4.115,22"
                    lastTransaction="Último lançamento dia 28 de setembro"
                />
                <HighlightCard
                    type="total"
                    title="Total"
                    amount="R$ 4.520,37"
                    lastTransaction="29 de setembro"
                />
            </HighlightCards>
            <Transactions>
                <Title>Listagem</Title>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <TransactionCard data={item} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: getBottomSpace(),
                    }}
                />
            </Transactions>
        </Container>
    );
}
