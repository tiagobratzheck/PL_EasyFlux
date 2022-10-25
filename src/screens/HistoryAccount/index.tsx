import React from "react";

import { Button } from "../../components/Forms/Button";
import { addMonths, subMonths, format } from "date-fns";

import firestore from "@react-native-firebase/firestore";

import { Container, Header, Title, Footer } from "./styles";

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
    totalFormatted: string;
    category: string;
    period: string;
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
    const [transactions, setTransactions] = React.useState<TransactionProps[]>(
        []
    );

    function loadTransactions() {
        const sixMonthsToSelectedDate = subMonths(selectedDate, 6);
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

                console.log(listOfPeriodsSelected);

                const totalByPeriod: TotalByPeriodProps[] = [];
                let quarter = 0;

                listOfPeriodsSelected.forEach((period) => {
                    let periodSum = 0;
                    let entryType = "";
                    let name = "";
                    let category = "";

                    quarter += 1;

                    dataFormatted.forEach((entry) => {
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
                            totalFormatted,
                            entryType,
                        });
                    }
                });

                console.log(totalByPeriod);
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
            <Footer>
                <Button title="Voltar" onPress={closeHistoryAccount}></Button>
            </Footer>
        </Container>
    );
}
