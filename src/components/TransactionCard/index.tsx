import React from "react";
import { Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { commonCategories } from "../../utils/categories";

import {
    Container,
    Description,
    DeleteRegister,
    DeleteIcon,
    Title,
    Amount,
    Footer,
    Category,
    Icon,
    CategoryName,
    DisplayDate,
} from "./styles";
import { useAuth } from "../../hooks/auth";

interface Category {
    name: string;
    icon: string;
}

export interface TransactionCardProps {
    id: string;
    entryType: "actual" | "budget";
    name: string;
    amount: string;
    category: string;
    date: string;
    period: string;
    type: "positive" | "negative";
}

interface Props {
    data: TransactionCardProps;
    selectedDate: Date;
}

export function TransactionCard({ data, selectedDate }: Props) {
    const { user } = useAuth();

    const category = commonCategories.filter(
        (item) => item.key === data.category
    )[0];

    const dateFormatted = Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    }).format(new Date(data.date));

    function deleteEntry(id: string) {
        Alert.alert("Atenção!", "Deseja realmente deletar esse lançamento?", [
            {
                text: "Cancelar",
                onPress: () => {},
            },
            {
                text: "Deletar",
                onPress: () =>
                    firestore()
                        .collection(`@EasyFlux:transactions_user:${user.id}`)
                        .doc(id)
                        .delete()
                        .then(() => {
                            Alert.alert("Lançamento deletado!");
                        }),
            },
        ]);
    }

    return (
        <Container>
            <Description>
                <Title>{data.name}</Title>
                {new Date().getMonth() === selectedDate.getMonth() &&
                new Date().getFullYear() === selectedDate.getFullYear() ? (
                    <DeleteRegister
                        onPress={() => {
                            deleteEntry(data.id);
                        }}
                    >
                        <DeleteIcon name="delete" />
                    </DeleteRegister>
                ) : null}
            </Description>
            <Amount type={data.type}>
                {data.type === "negative" && "-"}
                {data.amount}
            </Amount>
            <Footer>
                <Category>
                    <Icon name={category.icon} />
                    <CategoryName>{category.name}</CategoryName>
                </Category>
                <DisplayDate>{dateFormatted}</DisplayDate>
            </Footer>
        </Container>
    );
}
