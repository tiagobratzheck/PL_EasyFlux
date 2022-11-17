import React from "react";
import { Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { isAfter } from "date-fns";

import {
    Container,
    Icon,
    Title,
    Amount,
    Header,
    Description,
    Footer,
    DescriptionTotals,
    Account,
    Total,
    ResidualValue,
    Percent,
    DeleteRegister,
    DeleteIcon,
} from "./styles";
import { useAuth } from "../../hooks/auth";

interface Props {
    transactionType: string;
    selectedDate: Date;
    id: string;
    title: string;
    amount: string;
    color: string;
    icon: string;
    total: string;
    residual: string;
    percent: string;
}

export function BudgetCard({
    transactionType,
    selectedDate,
    id,
    title,
    amount,
    color,
    icon,
    total,
    residual,
    percent,
}: Props) {
    const { user } = useAuth();

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
        <Container color={color}>
            <Header>
                <Description>
                    <Icon name={icon} />
                    <Title>{title}</Title>
                </Description>
                <Description>
                    <Amount>{amount}</Amount>
                    {isAfter(selectedDate, new Date()) ? (
                        <DeleteRegister
                            onPress={() => {
                                deleteEntry(id);
                            }}
                        >
                            <DeleteIcon name="delete" />
                        </DeleteRegister>
                    ) : null}
                </Description>
            </Header>
            <Footer>
                <DescriptionTotals>
                    {transactionType === "positive" ? (
                        <Account>Total recebido no mês:</Account>
                    ) : (
                        <Account>Total gasto no mês:</Account>
                    )}

                    <Total>{total}</Total>
                    <ResidualValue residual={residual}>
                        {residual && `(${residual})`}
                    </ResidualValue>
                </DescriptionTotals>
                <Percent>{percent}</Percent>
            </Footer>
        </Container>
    );
}
