import React from "react";
import { Modal, Alert, FlatList } from "react-native";

import { addMonths, subMonths, format, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import uuid from "react-native-uuid";

import { Button } from "../../components/Forms/Button";
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton";
import { InputForm } from "../../components/Forms/InputForm";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";
import { CategorySelect } from "../CategorySelect";

import { useAuth } from "../../hooks/auth";
import { BudgetCard } from "../../components/BudgetCard";
import { commonCategories } from "../../utils/categories";
import { getBottomSpace } from "react-native-iphone-x-helper";

import {
    Container,
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
    const dataExample = [
        {
            amount: "R$ 4680,00",
            category: "salary",
            color: "#147819",
            icon: "account-cash-outline",
            date: "2022-11-10T22:45:54.358Z",
            id: "4407fb74-dc63-441c-aad3-1e38b769a834",
            name: "Salário",
            period: "novembro/2022",
            type: "positive",
            total: "R$ 4680,00",
            percent: "100,00%",
        },
        {
            amount: "R$ 1500,99",
            category: "supermarket",
            color: "#0A6407",
            icon: "warehouse",
            date: "2022-11-10T22:45:54.358Z",
            id: "4407fb74-dc63-441c-aad3-1e38b769a835",
            name: "Supermercado",
            period: "novembro/2022",
            type: "negative",
            total: "R$ 798,33",
            percent: "53,19%",
        },
        {
            amount: "R$ 85,00",
            category: "water",
            color: "#1F86DE",
            icon: "water-outline",
            date: "2022-11-10T22:45:54.358Z",
            id: "4407fb74-dc63-441c-aad3-1e38b769a836",
            name: "Água",
            period: "novembro/2022",
            type: "negative",
            total: "R$ 87,03",
            percent: "102,39%",
        },
        {
            amount: "R$ 120,50",
            category: "light",
            color: "#F0980C",
            icon: "lightbulb-outline",
            date: "2022-11-10T22:45:54.358Z",
            id: "4407fb74-dc63-441c-aad3-1e38b769a837",
            name: "Luz",
            period: "novembro/2022",
            type: "negative",
            total: "R$ 115,97",
            percent: "96,24%",
        },
        {
            amount: "R$ 1800,00",
            category: "rent",
            color: "#1C3EBD",
            icon: "home-outline",
            date: "2022-11-10T22:45:54.358Z",
            id: "4407fb74-dc63-441c-aad3-1e38b769a838",
            name: "Aluguel",
            period: "novembro/2022",
            type: "negative",
            total: "R$ 1699,12",
            percent: "94,40%",
        },
    ];

    const listCategoriesNotSelectable: string[] = [
        "salary",
        "supermarket",
        "water",
        "light",
        "rent",
    ];

    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [transactionType, setTransactionType] = React.useState("positive");
    const [categoryModalOpen, setCategoryModalOpen] = React.useState(false);
    const [category, setCategory] = React.useState({
        key: "category",
        name: "Categoria",
    });
    const { user } = useAuth();

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

        const totalFormatted = form.amount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });

        const categoryProperties = commonCategories.filter(
            (item) => item.key === category.key
        )[0];

        const budgetEntry = {
            id: String(uuid.v4()),
            name: category.name,
            amount: totalFormatted,
            type: transactionType,
            category: category.key,
            color: categoryProperties.color,
            icon: categoryProperties.icon,
            date: selectedDate,
            period: format(selectedDate, "MMMM/yyyy", { locale: ptBR }),
        };

        console.log(budgetEntry);
    }

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
                <FlatList
                    data={dataExample}
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
            </Content>
        </Container>
    );
}
