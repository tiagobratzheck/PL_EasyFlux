import React from "react";
import { Modal, Alert, FlatList, ActivityIndicator } from "react-native";

import { addMonths, subMonths, format, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";

import firestore from "@react-native-firebase/firestore";

import { TransactionCardProps } from "../../components/TransactionCard";

import { useTheme } from "styled-components";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { Button } from "../../components/Forms/Button";
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton";
import { InputForm } from "../../components/Forms/InputForm";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";
import { CategorySelect } from "../CategorySelect";

import { useAuth } from "../../hooks/auth";
import { BudgetCard } from "../../components/BudgetCard";
import { categoriesOutcome, commonCategories } from "../../utils/categories";
import { getBottomSpace } from "react-native-iphone-x-helper";

import {
    Container,
    LoadContainer,
    Content,
    TitleList,
    Header,
    Title,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    Form,
    Fields,
    TransactionsTypes,
} from "./styles";

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export interface BudgetListProps extends TransactionCardProps {
    color: string;
    icon: string;
    total: string;
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
    const [budgetEntries, setBudgetEntries] = React.useState<BudgetListProps[]>(
        []
    );
    const [listCategoriesNotSelectable, setListCategoriesNotSelectable] =
        React.useState<string[]>([]);

    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [transactionType, setTransactionType] = React.useState("positive");
    const [categoryModalOpen, setCategoryModalOpen] = React.useState(false);
    const [category, setCategory] = React.useState({
        key: "category",
        name: "Categoria",
    });

    const { user } = useAuth();
    const theme = useTheme();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    function handleTransactionsType(type: "positive" | "negative") {
        setTransactionType(type);
    }

    function handleCloseSelectCategory() {
        setCategoryModalOpen(false);
    }

    function handleOpenSelectCategory() {
        setCategoryModalOpen(true);
    }

    function handleDateChange(action: "next" | "prev") {
        if (action === "next") {
            const newDate = addMonths(selectedDate, 1);
            setSelectedDate(newDate);
        } else {
            const newDate = subMonths(selectedDate, 1);
            setSelectedDate(newDate);
        }
    }

    async function handleRegister(form: FormData) {
        if (!transactionType) {
            return Alert.alert("Selecione o tipo do lançamento");
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
            date: selectedDate,
            period: format(selectedDate, "MMMM/yyyy", { locale: ptBR }),
        };

        firestore()
            .collection("@EasyFlux:transactions_user:2547789544")
            .add(budgetEntry)
            .then(() => {
                reset();
                setCategory({
                    key: "category",
                    name: "Categoria",
                });
            })
            .catch((error: any) => {
                console.log(error);
                return Alert.alert(
                    "Solicitação",
                    "Não foi possível registrar o pedido"
                );
            })
            .finally(() => loadTransactions());
    }

    function loadTransactions() {
        setIsLoading(true);
        firestore()
            .collection("@EasyFlux:transactions_user:2547789544")
            .where("type", "==", transactionType)
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
                    (acumullator: number, expense: TransactionCardProps) => {
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

                const budgetDataFormatted: BudgetListProps[] = budgetData.map(
                    (entry: TransactionCardProps) => {
                        const categoryProperties = commonCategories.filter(
                            (item) => item.key === entry.category
                        )[0];

                        const totalActualByCategory: CategoryData =
                            totalByCategory.filter(
                                (item) => item.key === entry.category
                            )[0];

                        let percent: string = "";

                        if (totalActualByCategory) {
                            percent = `${(
                                (totalActualByCategory.total /
                                    Number(entry.amount)) *
                                100
                            ).toFixed(2)}%`;
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
                                categoryProperties && categoryProperties.color,
                            icon: categoryProperties && categoryProperties.icon,
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
                            percent,
                        };
                    }
                );
                setBudgetEntries(budgetDataFormatted);
                setListCategoriesNotSelectable(categoriesAlreadySelected);
                setIsLoading(false);
            });
    }

    React.useEffect(() => {
        const subscriber = loadTransactions();

        return subscriber;
    }, [selectedDate, transactionType]);

    return (
        <Container>
            <Header>
                <Title>Orçamentos</Title>
            </Header>
            <MonthSelect>
                <MonthSelectButton onPress={() => handleDateChange("prev")}>
                    <MonthSelectIcon name="chevron-left" />
                </MonthSelectButton>
                <Month>
                    {format(selectedDate, "MMMM, yyyy", {
                        locale: ptBR,
                    })}
                </Month>
                <MonthSelectButton onPress={() => handleDateChange("next")}>
                    <MonthSelectIcon name="chevron-right" />
                </MonthSelectButton>
            </MonthSelect>
            <Form>
                <TransactionsTypes>
                    <TransactionTypeButton
                        type="up"
                        title="Entrada"
                        onPress={() => {
                            handleTransactionsType("positive");
                        }}
                        isActive={transactionType === "positive"}
                    />
                    <TransactionTypeButton
                        type="down"
                        title="Saída"
                        onPress={() => {
                            handleTransactionsType("negative");
                        }}
                        isActive={transactionType === "negative"}
                    />
                </TransactionsTypes>
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
                    title="Cadastrar orçamento"
                    onPress={handleSubmit(handleRegister)}
                    enabled={isAfter(selectedDate, new Date()) ? true : false}
                ></Button>
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
            <Content>
                <TitleList>Lista de orçamentos:</TitleList>
                {isLoading ? (
                    <LoadContainer>
                        <ActivityIndicator
                            size={"large"}
                            color={theme.colors.primary}
                        />
                    </LoadContainer>
                ) : (
                    <FlatList
                        data={budgetEntries}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <BudgetCard
                                selectedDate={selectedDate}
                                key={item.category}
                                id={item.id}
                                title={item.name}
                                amount={item.amount}
                                color={item.color}
                                icon={item.icon}
                                total={item.total}
                                percent={item.percent}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: getBottomSpace(),
                        }}
                    />
                )}
            </Content>
        </Container>
    );
}
