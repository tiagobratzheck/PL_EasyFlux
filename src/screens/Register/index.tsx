import React, { useState } from "react";
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from "react-native";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { Button } from "../../components/Forms/Button";
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton";
import { Input } from "../../components/Forms/Input";
import { InputForm } from "../../components/Forms/InputForm";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";
import { CategorySelect } from "../CategorySelect";

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes,
} from "./styles";

export type FormData = {
    [name: string]: any;
};

const schema = Yup.object().shape({
    name: Yup.string().required("Nome é obrigatório"),
    amount: Yup.number()
        .typeError("Informe um valor numérico")
        .positive("O valor deve ser positivo")
        .required("Valor é obrigatório"),
});

export function Register() {
    const [transactionType, setTransactionType] = useState("");
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [category, setCategory] = useState({
        key: "category",
        name: "Categoria",
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    function handleTransactionsType(type: "up" | "down") {
        setTransactionType(type);
    }

    function handleCloseSelectCategory() {
        setCategoryModalOpen(false);
    }

    function handleOpenSelectCategory() {
        setCategoryModalOpen(true);
    }

    function handleRegister(form: FormData) {
        if (!transactionType) {
            return Alert.alert("Selecione o tipo do lançamento");
        }

        if (category.key === "category") {
            return Alert.alert("Selecione a categoria");
        }

        const data = {
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key,
        };
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>Lançamento</Title>
                </Header>
                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />
                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="valor"
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}
                        />
                        <TransactionsTypes>
                            <TransactionTypeButton
                                type="up"
                                title="Entrada"
                                onPress={() => {
                                    handleTransactionsType("up");
                                }}
                                isActive={transactionType === "up"}
                            />
                            <TransactionTypeButton
                                type="down"
                                title="Saída"
                                onPress={() => {
                                    handleTransactionsType("down");
                                }}
                                isActive={transactionType === "down"}
                            />
                        </TransactionsTypes>
                        <CategorySelectButton
                            onPress={handleOpenSelectCategory}
                            title={category.name}
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
            </Container>
        </TouchableWithoutFeedback>
    );
}
