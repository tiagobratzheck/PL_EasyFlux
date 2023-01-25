import firestore from "@react-native-firebase/firestore";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React from "react";
import { Button } from "../../components/Forms/Button";
import { useAuth } from "../../hooks/auth";
import { commonCategories } from "../../utils/categories";
import { Container, Footer, Header, Title } from "./styles";

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percentNumber: number;
    percent: string;
}

interface OutOfBudgetRegistersProps {
    transactionType: string;
    listBudgetCategories: string[];
    dateTransactions: Date;
    closeOutOfBudgetRegisters: () => void;
}

export function OutOfBudgetRegisters({
    transactionType,
    listBudgetCategories,
    dateTransactions,
    closeOutOfBudgetRegisters,
}: OutOfBudgetRegistersProps) {
    const { user } = useAuth();

    React.useEffect(() => {
        firestore()
            .collection(`@EasyFlux:transactions_user:${user.id}`)
            .where("type", "==", transactionType)
            .where(
                "period",
                "==",
                format(dateTransactions, "MMMM/yyyy", { locale: ptBR })
            )
            .onSnapshot((snapshot) => {
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
                });
                
                const listBudget = dataTransformed.filter(
                    (register) => register.entryType === "budget"
                );
               
                const sumBudgetRegisters = listBudget.reduce(
                    (acumullator: number, entry) => {
                        return acumullator + Number(entry.amount);
                    },
                    0
                );
              
                const listActuals = dataTransformed.filter(
                    (register) => register.entryType === "actual"
                );
              
                const sumActualsRegisters = listActuals.reduce(
                    (acumullator: number, entry) => {
                        return acumullator + Number(entry.amount);
                    },
                    0
                );
               
                const actualsInBugdet = listActuals.filter((register) =>
                    listBudgetCategories.includes(register.category)
                );
             
                const sumActualsInBudget = actualsInBugdet.reduce(
                    (acumullator: number, entry) => {
                        return acumullator + Number(entry.amount);
                    },
                    0
                );
               
                const actualsOutOfBugdet = listActuals.filter(
                    (register) =>
                        !listBudgetCategories.includes(register.category)
                );
              
                const sumActualsOutOfBudget = actualsOutOfBugdet.reduce(
                    (acumullator: number, entry) => {
                        return acumullator + Number(entry.amount);
                    },
                    0
                );

                const totalByCategory: CategoryData[] = [];

                commonCategories.forEach((category) => {
                    let categorySum = 0;
                    actualsOutOfBugdet.forEach((entry) => {
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

                        const percentNumber = ((categorySum / sumActualsOutOfBudget) * 100);                        
                        const percent = `${(
                            (categorySum / sumActualsOutOfBudget) *
                            100
                        ).toFixed(2)}%`;

                        totalByCategory.push({
                            key: category.key,
                            name: category.name,
                            color: category.color,
                            total: categorySum,
                            totalFormatted,
                            percent,
                            percentNumber
                        });
                    }
                });
                totalByCategory.sort((a, b) =>
                    a.total < b.total ? 1 : b.total < a.total ? -1 : 0
                );                
            });
    }, []);

    return (
        <Container>
            <Header>
                <Title>
                    {transactionType === "positive"
                        ? "Entradas não planejadas"
                        : "Despesas não planejadas"}
                </Title>
            </Header>
            <Footer>
                <Button title="Voltar" onPress={closeOutOfBudgetRegisters} />
            </Footer>
        </Container>
    );
}
