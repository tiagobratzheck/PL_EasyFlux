import React from "react";
import { Modal, Alert } from "react-native";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { addMonths, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { Button } from "../../components/Forms/Button";
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton";
import { InputForm } from "../../components/Forms/InputForm";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";
import { CategorySelect } from "../CategorySelect";

import {
    Container,
    Content,
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

import { useAuth } from "../../hooks/auth";
import { BudgetCard } from "../../components/BudgetCard";

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
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [transactionType, setTransactionType] = React.useState("");
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
                    title="Lançar"
                    onPress={handleSubmit(handleRegister)}
                ></Button>
            </Form>
            <Modal visible={categoryModalOpen}>
                <CategorySelect
                    category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseSelectCategory}
                    transactionType={transactionType}
                />
            </Modal>
            <Content
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingBottom: useBottomTabBarHeight(),
                }}
            >
                <BudgetCard
                    key="{item.key}"
                    title="Supermercado"
                    amount="R$1.500,00"
                    color="{item.color}"
                />
                <BudgetCard
                    key="{item.key}"
                    title="Supermercado"
                    amount="R$1.500,00"
                    color="{item.color}"
                />
                <BudgetCard
                    key="{item.key}"
                    title="Supermercado"
                    amount="R$1.500,00"
                    color="{item.color}"
                />
                <BudgetCard
                    key="{item.key}"
                    title="Supermercado"
                    amount="R$1.500,00"
                    color="{item.color}"
                />
                <BudgetCard
                    key="{item.key}"
                    title="Supermercado"
                    amount="R$1.500,00"
                    color="{item.color}"
                />
            </Content>
        </Container>
    );
}
