import firestore from "@react-native-firebase/firestore";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React, { useState } from "react";
import { FlatList } from "react-native";
import { Button } from "../../components/Forms/Button";
import theme from "../../global/styles/theme";
import { useAuth } from "../../hooks/auth";
import { commonCategories } from "../../utils/categories";
import {
    AmountCard, AmountEntry, Cards, CategoryEntry, Container,
    ContainerCard, Description, Footer,
    FooterCard,
    Header, Icon, ListEntries, NameEntry, PercentCard, Separator, Title, TitleCard, TitleList, VisualCards
} from "./styles";

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    icon: string;
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

    const [totalBudget, setTotalBudget] = useState<string>('');
    const [colors, setColors] = useState({
        colorFirstCard: '#ffffff',
        colorSecondCard: '#ffffff',
        colorThirdCard: '#ffffff',
        colorFourthCard: '#ffffff'
    })
    const [totalEntries, setTotalEntries] = useState({
        value: '',
        percentage: '',
    })
    const [totalEntriesInBudget, setTotalEntriesInBudget] = useState({
        value: '',
        percentage: '',
    })
    const [totalEntriesOutOfBudget, setTotalEntriesOutOfBudget] = useState({
        value: '',
        percentage: '',
    })
    const [entries, setEntries] = useState<CategoryData[]>([]);
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

                setTotalBudget(sumBudgetRegisters.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }
                ));

                const listActuals = dataTransformed.filter(
                    (register) => register.entryType === "actual"
                );

                const sumActualsRegisters = listActuals.reduce(
                    (acumullator: number, entry) => {
                        return acumullator + Number(entry.amount);
                    },
                    0
                );

                setTotalEntries({
                    value: sumActualsRegisters.toLocaleString(
                        "pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        }
                    ),
                    percentage: `${((sumActualsRegisters / sumBudgetRegisters) * 100).toFixed(2)}%`
                })

                const actualsInBugdet = listActuals.filter((register) =>
                    listBudgetCategories.includes(register.category)
                );

                const sumActualsInBudget = actualsInBugdet.reduce(
                    (acumullator: number, entry) => {
                        return acumullator + Number(entry.amount);
                    },
                    0
                );

                setTotalEntriesInBudget({
                    value: sumActualsInBudget.toLocaleString(
                        "pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        }
                    ),
                    percentage: `${((sumActualsInBudget / sumActualsRegisters) * 100).toFixed(2)}%`
                })

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
                
                setTotalEntriesOutOfBudget({
                    value: sumActualsOutOfBudget.toLocaleString(
                        "pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        }
                    ),
                    percentage: `${((sumActualsOutOfBudget / sumActualsRegisters) * 100).toFixed(2)}%`
                })

                setColors({
                    colorFirstCard : theme.colors.success,
                    colorSecondCard: transactionType === 'positive' ? 
                        theme.colors.secondary : theme.colors.attention,
                    colorThirdCard: transactionType === 'positive' ? 
                        theme.colors.secondary : theme.colors.attention,
                    colorFourthCard: transactionType === 'positive' ?
                        theme.colors.secondary : ( sumActualsOutOfBudget > 0 ? 
                        theme.colors.attention : theme.colors.success )
                })

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

                        const percentNumber =
                            (categorySum / sumActualsOutOfBudget) * 100;
                        const percent = `${(
                            (categorySum / sumActualsOutOfBudget) *
                            100
                        ).toFixed(2)}%`;
                     
                        totalByCategory.push({
                            key: category.key,
                            name: category.name,
                            icon: category.icon,
                            color: category.color,
                            total: categorySum,
                            totalFormatted,
                            percent,
                            percentNumber,
                        });
                    }
                });
                totalByCategory.sort((a, b) =>
                    a.total < b.total ? 1 : b.total < a.total ? -1 : 0
                );
                setEntries(totalByCategory);
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
            <Cards>
            <VisualCards>
                <ContainerCard color={colors.colorFirstCard}>
                    <TitleCard>Orçamento</TitleCard>
                    <FooterCard>
                        <AmountCard>{totalBudget}</AmountCard>                        
                    </FooterCard>
                </ContainerCard>

                <ContainerCard color={colors.colorSecondCard}>
                    <TitleCard>{transactionType === 'positive' ? 'Total de entradas' : 'Total de Saídas'}</TitleCard>
                    <FooterCard>
                        <AmountCard>{totalEntries.value}</AmountCard>
                        <PercentCard>{totalEntries.percentage}</PercentCard>
                    </FooterCard>
                </ContainerCard>
            </VisualCards>

            <VisualCards>
                <ContainerCard color={colors.colorThirdCard}>
                    <TitleCard>
                        {transactionType === 'positive' ? 'Entradas com orçamento' : 'Saídas com orçamento'}
                    </TitleCard>
                    <FooterCard>
                        <AmountCard>{totalEntriesInBudget.value}</AmountCard>
                        <PercentCard>{totalEntriesInBudget.percentage}</PercentCard>
                    </FooterCard>
                </ContainerCard>

                <ContainerCard color={colors.colorFourthCard}>
                    <TitleCard>
                        {transactionType === 'positive' ? 'Entradas sem orçamento' : 'Saídas sem orçamento'}
                    </TitleCard>
                    <FooterCard>
                        <AmountCard>{totalEntriesOutOfBudget.value}</AmountCard>
                        <PercentCard>{totalEntriesOutOfBudget.percentage}</PercentCard>
                    </FooterCard>
                </ContainerCard>
            </VisualCards>
            </Cards>

            <ListEntries>
                <TitleList>Lista de lançamentos</TitleList>
                <FlatList
                    data={entries}
                    keyExtractor={(item) => item.key}                
                    renderItem={({ item }) => (
                        <CategoryEntry>
                            <Description>
                                <Icon name={item.icon} />
                                <NameEntry>{item.name}</NameEntry>
                            </Description>
                            <AmountEntry>{item.totalFormatted}</AmountEntry>
                        </CategoryEntry>
                    )}
                    ItemSeparatorComponent={() => <Separator />}
                />
            </ListEntries>

            <Footer>
                <Button title="Voltar" onPress={closeOutOfBudgetRegisters} />
            </Footer>
        </Container>
    );
}
