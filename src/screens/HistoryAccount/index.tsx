import React from "react";
import { ActivityIndicator, View } from "react-native";

import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "../../components/Forms/Button";

import firestore from "@react-native-firebase/firestore";

import { VictoryAxis, VictoryBar, VictoryChart } from "victory-native";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import theme from "../../global/styles/theme";
import { useAuth } from "../../hooks/auth";
import { commonCategories } from "../../utils/categories";
import {
    CategoryInformation, CategoryName, CellTable,
    CellWrapper, Container, Content, Description, DescriptionHeaderCell, DescriptionResult, Footer, Header, HeaderTable, HeaderWrapper, Icon, LoadContainer, Title
} from "./styles";

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
    amount: number;
    totalFormatted: string;
    category: string;
    date: string;
    period: string;
    type: string;
}

interface Category {
    key: string;
    name: string;
    icon: string;
    color: string;
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
    const { user } = useAuth();

    const [isLoading, setIsLoading] = React.useState(true);
    const [barRatio, setBarRatio] = React.useState<number>(0.8);
    const [actualTransactions, setActualTransactions] = React.useState<
        TotalByPeriodProps[]
    >([]);
    const [actualTransactionsForTable, setActualTransactionsForTable] = React.useState<
        TotalByPeriodProps[]
    >([]);
    const [budgetTransactions, setBudgetTransactions] = React.useState<
        TransactionProps[]
    >([]);
    const [listPeriods, setListPeriods] = React.useState<string[]>([]);
    const [categoryProperties, setCategoryProperties] =
        React.useState<Category>({} as Category);

    function searchBudgetPeriod(period: string) {
        const budget = budgetTransactions.filter(
            (item) => item.period === period
        )[0];

        if (budget) {
            const budgetFormatted = Number(budget.amount).toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL",
                }
            );
            return budgetFormatted;
        } else {
            return "R$0,00";
        }
    }

    function calculateResult(period: string, type: string) {
        const budget = budgetTransactions.filter(
            (item) => item.period === period
        )[0];

        const total = actualTransactions.filter(
            (item) => item.date === period
        )[0];

        if (budget) {
            if (type === "negative") {
                const result = Number(budget.amount) - Number(total.amount);
                return result.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                });
            } else {
                const result = Number(total.amount) - Number(budget.amount);
                return result.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                });
            }
        } else if (total && type === "negative" && total.amount !== 0) {
            return `-${total.totalFormatted}`;
        } else {
            return `R$ 0,00`;
        }
    }

    function loadTransactions() {
        const sixMonthsToSelectedDate = subMonths(selectedDate, 5);
        
        firestore()
            .collection(`@EasyFlux:transactions_user:${user.id}`)
            .where("category", "==", category)
            .where("date", ">=", startOfMonth(sixMonthsToSelectedDate))
            .where("date", "<=", endOfMonth(selectedDate))
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

                const dataActualFormatted = dataFormatted.filter(
                    (entry) => entry.entryType === "actual"
                );

                const totalBudgetByPeriod: TransactionProps[] =
                    dataFormatted.filter(
                        (entry) => entry.entryType === "budget"
                    );               

                const totalByPeriod: TotalByPeriodProps[] = [];               

                let listOfPeriods: Date[] = [];
                const listOfDatesUniques: string[] = [];

                for(var i=0; i<=5; i++){
                    listOfPeriods.push((subMonths(selectedDate, i)))
                }

                listOfPeriods.reverse();

                listOfPeriods.forEach((date)=>{
                    listOfDatesUniques.push(format(new Date(date), "MMM/yyyy", { locale: ptBR }))
                })
               
                setListPeriods(listOfDatesUniques);

                let quarter = 0;

                listOfPeriods.forEach((period) => {
                    let datePeriod = format(new Date(period), "MMMM/yyyy", { locale: ptBR })                  
                    let periodSum = 0;
                    let entryType = "";
                    let name = "";
                    let category = "";
                    let date = "";
                    let type = "";
                    quarter += 1;

                    dataActualFormatted.forEach((entry) => {                      
                        entryType = entry.entryType;
                        type = entry.type;
                        name = entry.name;
                        category = entry.category;
                        date = entry.date;

                        if(entry.period === datePeriod){                                                    
                            periodSum += Number(entry.amount);                       
                        }
                    })
                    
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
                        period: format(new Date(period), "MMM/yyyy", {
                            locale: ptBR,
                        }),
                        date: format(new Date(period), "MMMM/yyyy", {
                            locale: ptBR,
                        }),
                        amount: periodSum,
                        totalFormatted,
                        entryType,
                        type,
                    });
                                                   
                })
                                                   
                setActualTransactions(totalByPeriod);  
                setActualTransactionsForTable(totalByPeriod.reverse())              
                
                if (totalBudgetByPeriod.length > 0) {
                    setBudgetTransactions(totalBudgetByPeriod);
                }

                const categoryProps = commonCategories.filter(
                    (item) => item.key === category
                )[0];
                setCategoryProperties(categoryProps);

                setIsLoading(false);
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
            <Content
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: useBottomTabBarHeight(),
                }}
            >
                {isLoading ? (
                    <LoadContainer>
                        <ActivityIndicator
                            size={"large"}
                            color={theme.colors.primary}
                        />
                    </LoadContainer>
                ) : (
                    <>
                        <CategoryInformation>
                            <Icon name={categoryProperties.icon} />
                            <CategoryName>
                                {categoryProperties.name}
                            </CategoryName>
                        </CategoryInformation>
                        <View>
                            <VictoryChart
                                width={380}
                                domainPadding={25}
                                animate={{
                                    duration: 2000,
                                    onLoad: {duration: 1000}
                                }}
                                padding={{
                                    left: 55,
                                    right: 30,
                                    bottom: 35,
                                    top: 20,
                                }}
                            >
                                <VictoryAxis
                                    dependentAxis
                                    style={{ tickLabels: { fontSize: 11 } }}
                                />
                                <VictoryBar
                                    barRatio={barRatio}
                                    cornerRadius={3}
                                    alignment={"middle"}
                                    data={actualTransactions}
                                    x="quarter"
                                    y="amount"
                                    labels={({ datum }) =>
                                        `${datum.totalFormatted}`
                                    }
                                    style={{
                                        data: {
                                            fill: categoryProperties.color,
                                        },
                                        labels: {
                                            fontSize: 9,
                                        },
                                    }}
                                />

                                <VictoryAxis
                                    orientation="bottom"
                                    width={380}
                                    tickValues={[1, 2, 3, 4, 5, 6]}
                                    tickFormat={listPeriods}
                                    style={{ tickLabels: { fontSize: 10 } }}
                                />
                            </VictoryChart>
                        </View>
                        <HeaderWrapper>
                            <HeaderTable color={categoryProperties.color}>
                                <DescriptionHeaderCell>
                                    Período
                                </DescriptionHeaderCell>
                                <DescriptionHeaderCell>
                                    Orçamento
                                </DescriptionHeaderCell>
                                <DescriptionHeaderCell>
                                    Realizado
                                </DescriptionHeaderCell>
                                <DescriptionHeaderCell>
                                    Diferença
                                </DescriptionHeaderCell>
                            </HeaderTable>
                        </HeaderWrapper>
                        <CellWrapper>
                            {actualTransactionsForTable.map((entry) => {
                                return (
                                    <CellTable key={entry.period}>
                                        <Description>{entry.period}</Description>
                                        <Description>
                                            {searchBudgetPeriod(entry.date)}
                                        </Description>

                                        <Description>
                                            {entry.totalFormatted}
                                        </Description>
                                        <DescriptionResult
                                            amount={calculateResult(
                                                entry.date,
                                                entry.type
                                            )}
                                        >
                                            {calculateResult(
                                                entry.date,
                                                entry.type
                                            )}
                                        </DescriptionResult>
                                    </CellTable>
                                );
                            })}
                        </CellWrapper>
                    </>
                )}
            </Content>

            <Footer>
                <Button title="Voltar" onPress={closeHistoryAccount}></Button>
            </Footer>
        </Container>
    );
}
