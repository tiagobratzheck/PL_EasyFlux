import React from "react";
import { ActivityIndicator, Alert, FlatList, Modal } from "react-native";

import { format, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";

import firestore from "@react-native-firebase/firestore";

import { TransactionCardProps } from "../../components/TransactionCard";

import { useTheme } from "styled-components";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { Button } from "../../components/Forms/Button";
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton";
import { InputForm } from "../../components/Forms/InputForm";
import { CategorySelect } from "../CategorySelect";

import { getBottomSpace } from "react-native-iphone-x-helper";
import { BudgetCard } from "../../components/BudgetCard";
import { useAuth } from "../../hooks/auth";
import { useDate } from "../../hooks/date";
import { commonCategories } from "../../utils/categories";

import { TransactionTypeButtonForBudget } from "../../components/Forms/TransactionTypeButtonForBudget";
import { ResultActualCard } from "../../components/ResultActualCard";
import { ResultBudgetCard } from "../../components/ResultBudgetCard";
import { BudgetHistory } from "../BudgetHistory";
import { OutOfBudgetRegisters } from "../OutOfBudgetRegisters";
import {
    Container,
    Content,
    Fields,
    Form,
    Header,
    LoadContainer,
    Month,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Title,
    TitleList,
    TransactionsTypes
} from "./styles";

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

interface BudgetResultProps {
    entrySum: string;
    expenseSum: string;
    result: string;
}

export interface BudgetListProps extends TransactionCardProps {
    color: string;
    icon: string;
    total: string;
    residual: string;
    percent: string;
}

export type FormData = {
    [name: string]: any;
};

const schema = Yup.object().shape({
    amount: Yup.number()
        .transform((o, v) => parseFloat(v.replace(/,/g, ".")))
        .typeError("Informe um valor numérico")
        .positive("O valor deve ser positivo")
        .required("Valor é obrigatório"),
});

export function Budget() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(true);

    const [budgetEntries, setBudgetEntries] = React.useState<BudgetListProps[]>(
        []
    );
    const [listBudgetCategories, setListBudgetCategories] = React.useState<
        string[]
    >([]);
    const [listCategoriesNotSelectable, setListCategoriesNotSelectable] =
        React.useState<string[]>([]);

    const [budgetResult, setBudgetResult] = React.useState<BudgetResultProps>({
        entrySum: "R$0,00",
        expenseSum: "R$0,00",
        result: "R$0,00",
    });
    const [actualResult, setActualResult] = React.useState<BudgetResultProps>({
        entrySum: "R$0,00",
        expenseSum: "R$0,00",
        result: "R$0,00",
    });
    const [result, setResult] = React.useState<BudgetResultProps>({
        entrySum: "R$0,00",
        expenseSum: "R$0,00",
        result: "R$0,00",
    });

    const [transactionType, setTransactionType] = React.useState("positive");
    const [categoryModalOpen, setCategoryModalOpen] = React.useState(false);
    const [outOfBudgetModalOpen, setOutOfBudgetModalOpen] =
        React.useState(false);
    const [budgetHistoryModalOpen, setBudgetHistoryModalOpen] =
        React.useState(false);
    const [category, setCategory] = React.useState({
        key: "category",
        name: "Categoria",
    });

    const { user } = useAuth();
    const { dateTransactions, changeDateTransactions } = useDate();
    const theme = useTheme();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const handleListFooter = () => {
        if (!isAfter(dateTransactions, new Date())) {
            return (
                <Button
                    themeColor="light"
                    title={
                        transactionType === "positive"
                            ? "Ver entradas fora do orçamento"
                            : "Ver despesas fora do orçamento"
                    }
                    onPress={handleOpenEntriesOutOfBudget}
                ></Button>
            );
        } else {
            return null;
        }
    };

    function handleTransactionsType(type: "positive" | "negative" | "result") {
        setTransactionType(type);
    }

    function handleOpenEntriesOutOfBudget() {
        setOutOfBudgetModalOpen(true);
    }

    function handleCloseEntriesOutOfBudget() {
        setOutOfBudgetModalOpen(false);
    }

    function handleCloseSelectCategory() {
        setCategoryModalOpen(false);
    }

    function handleOpenSelectCategory() {
        setCategoryModalOpen(true);
    }

    function handleOpenBudgetHistory() {
        setBudgetHistoryModalOpen(true);
    }

    function handleCloseBudgetHistory() {
        setBudgetHistoryModalOpen(false);
    }

    async function handleRegister(form: FormData) {
        if (!transactionType) {
            return Alert.alert("Selecione o tipo do lançamento");
        }

        if (transactionType === "result") {
            setCategory({
                key: "category",
                name: "Categoria",
            });
            return Alert.alert("Selecione Entrada ou Saída");
        }

        if (category.key === "category") {
            return Alert.alert("Selecione a categoria");
        }

        const budgetEntry = {
            entryType: "budget",
            name: category.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: dateTransactions,
            period: format(dateTransactions, "MMMM/yyyy", { locale: ptBR }),
        };
        setIsSaving(false);
        firestore()
            .collection(`@EasyFlux:transactions_user:${user.id}`)
            .add(budgetEntry)
            .then(() => {
                reset();
                setCategory({
                    key: "category",
                    name: "Categoria",
                });
                setIsSaving(true);
            })
            .catch((error: any) => {
                console.log(error);
                return Alert.alert(
                    "Solicitação",
                    "Não foi possível registrar o pedido"
                );
            });
    }

    function loadTransactions() {
        setIsLoading(true);
        if (transactionType === "result") {
            calculateBudgetResult(dateTransactions);
        } else {
            firestore()
                .collection(`@EasyFlux:transactions_user:${user.id}`)
                .where("type", "==", transactionType)
                .where(
                    "period",
                    "==",
                    format(dateTransactions, "MMMM/yyyy", { locale: ptBR })
                )
                .onSnapshot((snapshot) => {
                    const dataTransformed: TransactionCardProps[] =
                        snapshot.docs.map((doc) => {
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

                    const budgetData: TransactionCardProps[] =
                        dataTransformed.filter(
                            (entry: TransactionCardProps) =>
                                entry.entryType === "budget"
                        );
                    const actualData: TransactionCardProps[] =
                        dataTransformed.filter(
                            (entry: TransactionCardProps) =>
                                entry.entryType === "actual"
                        );

                    const expensesTotal = actualData.reduce(
                        (
                            acumullator: number,
                            expense: TransactionCardProps
                        ) => {
                            return acumullator + Number(expense.amount);
                        },
                        0
                    );

                    const totalByCategory: CategoryData[] = [];

                    commonCategories.forEach((category) => {
                        let categorySum = 0;
                        actualData.forEach((expense: TransactionCardProps) => {
                            if (expense.category === category.key) {
                                categorySum += Number(expense.amount);
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

                            const percent = `${(
                                (categorySum / expensesTotal) *
                                100
                            ).toFixed(2)}%`;

                            totalByCategory.push({
                                key: category.key,
                                name: category.name,
                                color: category.color,
                                total: categorySum,
                                totalFormatted,
                                percent,
                            });
                        }
                    });

                    let categoriesAlreadySelected: string[] = [];

                    const budgetDataFormatted: BudgetListProps[] =
                        budgetData.map((entry: TransactionCardProps) => {
                            const categoryProperties = commonCategories.filter(
                                (item) => item.key === entry.category
                            )[0];

                            const totalActualByCategory: CategoryData =
                                totalByCategory.filter(
                                    (item) => item.key === entry.category
                                )[0];

                            let percent: string = "";
                            let residual: number;
                            let residualFormatted: string = "";

                            if (totalActualByCategory) {
                                percent = `${(
                                    (totalActualByCategory.total /
                                        Number(entry.amount)) *
                                    100
                                ).toFixed(2)}%`;

                                if (entry.type === "negative") {
                                    residual =
                                        Number(entry.amount) -
                                        totalActualByCategory.total;
                                } else {
                                    residual =
                                        totalActualByCategory.total -
                                        Number(entry.amount);
                                }

                                residualFormatted = residual.toLocaleString(
                                    "pt-BR",
                                    {
                                        style: "currency",
                                        currency: "BRL",
                                    }
                                );
                            }

                            const amountFormatted = Number(
                                entry.amount
                            ).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            });

                            categoriesAlreadySelected.push(entry.category);

                            return {
                                amount: amountFormatted,
                                category: entry.category,
                                color:
                                    categoryProperties &&
                                    categoryProperties.color,
                                icon:
                                    categoryProperties &&
                                    categoryProperties.icon,
                                entryType: entry.entryType,
                                date: entry.date,
                                id: entry.id,
                                name: entry.name,
                                period: entry.period,
                                type: entry.type,
                                total: totalActualByCategory
                                    ? totalActualByCategory.total.toLocaleString(
                                          "pt-BR",
                                          {
                                              style: "currency",
                                              currency: "BRL",
                                          }
                                      )
                                    : "R$ 0,00",
                                residual: residualFormatted,
                                percent,
                            };
                        });

                    const listCategories: string[] = [];
                    budgetData.forEach((element) =>
                        listCategories.push(element.category)
                    );
                    listCategories.filter((element, index) => {
                        return listCategories.indexOf(element) === index;
                    });
                    setListBudgetCategories(listCategories);

                    setBudgetEntries(budgetDataFormatted);
                    setListCategoriesNotSelectable(categoriesAlreadySelected);
                    setIsLoading(false);
                });
        }
    }

    function calculateBudgetResult(selectedDate: Date) {
        firestore()
            .collection(`@EasyFlux:transactions_user:${user.id}`)
            .where(
                "period",
                "==",
                format(selectedDate, "MMMM/yyyy", { locale: ptBR })
            )
            .onSnapshot((snapshot) => {
                const dataTransformed: TransactionCardProps[] =
                    snapshot.docs.map((doc) => {
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

                const entryBudgets = dataTransformed.filter(
                    (entry) =>
                        entry.type === "positive" &&
                        entry.entryType === "budget"
                );

                const expenseBudgets = dataTransformed.filter(
                    (entry) =>
                        entry.type === "negative" &&
                        entry.entryType === "budget"
                );

                const sumEntries = entryBudgets.reduce(
                    (acumullator: number, entry) => {
                        return acumullator + Number(entry.amount);
                    },
                    0
                );
                const sumExpenses = expenseBudgets.reduce(
                    (acumullator: number, entry) => {
                        return acumullator + Number(entry.amount);
                    },
                    0
                );

                const budgetResult = sumEntries - sumExpenses;

                const entryActuals = dataTransformed.filter(
                    (entry) =>
                        entry.type === "positive" &&
                        entry.entryType === "actual"
                );

                const expenseActuals = dataTransformed.filter(
                    (entry) =>
                        entry.type === "negative" &&
                        entry.entryType === "actual"
                );

                const sumActualsEntries = entryActuals.reduce(
                    (acumullator: number, entry) => {
                        return acumullator + Number(entry.amount);
                    },
                    0
                );
                const sumActualsExpenses = expenseActuals.reduce(
                    (acumullator: number, entry) => {
                        return acumullator + Number(entry.amount);
                    },
                    0
                );

                const actualResult = sumActualsEntries - sumActualsExpenses;

                const actualBudgetEntriesResult =
                    sumActualsEntries - sumEntries;
                const actualBudgetExpensesResult =
                    sumExpenses - sumActualsExpenses;
                const actualBudgetResult = actualResult - budgetResult;

                setBudgetResult({
                    entrySum: sumEntries.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }),
                    expenseSum: sumExpenses.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }),
                    result: budgetResult.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }),
                });

                setActualResult({
                    entrySum: sumActualsEntries.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }),
                    expenseSum: sumActualsExpenses.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }),
                    result: actualResult.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }),
                });

                setResult({
                    entrySum: actualBudgetEntriesResult.toLocaleString(
                        "pt-BR",
                        {
                            style: "currency",
                            currency: "BRL",
                        }
                    ),
                    expenseSum: actualBudgetExpensesResult.toLocaleString(
                        "pt-BR",
                        {
                            style: "currency",
                            currency: "BRL",
                        }
                    ),
                    result: actualBudgetResult.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }),
                });
                setIsLoading(false);
            });
    }

    React.useEffect(() => {
        const subscriber = loadTransactions();

        return subscriber;
    }, [dateTransactions, transactionType]);

    return (
        <Container>
            <Header>
                <Title>Orçamentos</Title>
            </Header>
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
            <Form>
                <TransactionsTypes>
                    <TransactionTypeButtonForBudget
                        type="up"
                        title="Entrada"
                        onPress={() => {
                            handleTransactionsType("positive");
                        }}
                        isActive={transactionType === "positive"}
                    />
                    <TransactionTypeButtonForBudget
                        type="down"
                        title="Saída"
                        onPress={() => {
                            handleTransactionsType("negative");
                        }}
                        isActive={transactionType === "negative"}
                    />
                    <TransactionTypeButtonForBudget
                        type="result"
                        title="Resultado"
                        onPress={() => {
                            handleTransactionsType("result");
                        }}
                        isActive={transactionType === "result"}
                    />
                </TransactionsTypes>
                {isAfter(dateTransactions, new Date()) ? (
                    <>
                        <CategorySelectButton
                            onPress={handleOpenSelectCategory}
                            title={category.name}
                        />
                        <Fields>
                            <InputForm
                                name="amount"
                                control={control}
                                placeholder="valor"
                                keyboardType="numeric"
                                error={errors.amount && errors.amount.message}
                            />
                        </Fields>
                        <Button
                            title={
                                isSaving ? "Cadastrar orçamento" : "Salvando..."
                            }
                            onPress={handleSubmit(handleRegister)}
                            enabled={isSaving}
                        ></Button>
                    </>
                ) : null}
            </Form>
            <Modal visible={categoryModalOpen}>
                <CategorySelect
                    category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseSelectCategory}
                    transactionType={transactionType}
                    listCategoriesNotSelectable={listCategoriesNotSelectable}
                />
            </Modal>
            <Modal visible={outOfBudgetModalOpen}>
                <OutOfBudgetRegisters
                    transactionType={transactionType}
                    listBudgetCategories={listBudgetCategories}
                    dateTransactions={dateTransactions}
                    closeOutOfBudgetRegisters={handleCloseEntriesOutOfBudget}
                />
            </Modal>
            <Modal visible={budgetHistoryModalOpen}>
                <BudgetHistory
                    transactionDate={dateTransactions}
                    handleCloseBudgetHistory={handleCloseBudgetHistory}
                />
            </Modal>
            <Content>
                {transactionType === "result" ? (
                    <TitleList>Orçamento:</TitleList>
                ) : (
                    <TitleList>Lista de orçamentos:</TitleList>
                )}

                {isLoading ? (
                    <LoadContainer>
                        <ActivityIndicator
                            size={"large"}
                            color={theme.colors.primary}
                        />
                    </LoadContainer>
                ) : transactionType !== "result" ? (
                    <FlatList
                        data={budgetEntries}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <BudgetCard
                                transactionType={transactionType}
                                selectedDate={dateTransactions}
                                key={item.category}
                                id={item.id}
                                title={item.name}
                                amount={item.amount}
                                color={item.color}
                                icon={item.icon}
                                total={item.total}
                                residual={item.residual}
                                percent={item.percent}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: getBottomSpace(),
                        }}
                        ListFooterComponent={handleListFooter}
                    />
                ) : (
                    <>
                        <ResultBudgetCard
                            entrySum={budgetResult.entrySum}
                            expenseSum={budgetResult.expenseSum}
                            result={budgetResult.result}
                        />
                        <TitleList>Resultado:</TitleList>
                        <ResultActualCard
                            entrySum={actualResult.entrySum}
                            budgetEntrySum={result.entrySum}
                            expenseSum={actualResult.expenseSum}
                            budgetExpenseSum={result.expenseSum}
                            result={actualResult.result}
                            budgetResultSum={result.result}
                        />
                        {isAfter(dateTransactions, new Date()) ? null : (
                            <Button
                                themeColor="light"
                                title="Conferir histórico"
                                onPress={ handleOpenBudgetHistory }
                            ></Button>
                        )}
                    </>
                )}
            </Content>
        </Container>
    );
}
