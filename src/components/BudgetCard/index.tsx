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

interface Props {
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
                        .collection("@EasyFlux:transactions_user:2547789544")
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
                    <Account>Total para essa conta:</Account>
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
