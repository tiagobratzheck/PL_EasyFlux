import React, { useState } from "react";
import { Keyboard, Modal, Alert } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
    useNavigation,
    NavigationProp,
    ParamListBase,
} from "@react-navigation/native";

import uuid from "react-native-uuid";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "../../components/Forms/Button";
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../hooks/auth";

export type FormData = {
    [name: string]: any;
};

const schema = Yup.object().shape({
    name: Yup.string().required("Nome é obrigatório"),
    amount: Yup.number()
        .transform((o, v) => parseFloat(v.replace(/,/g, ".")))
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
    const { user } = useAuth();

    const { navigate }: NavigationProp<ParamListBase> = useNavigation();

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

    async function handleRegister(form: FormData) {
        if (!transactionType) {
            return Alert.alert("Selecione o tipo do lançamento");
        }

        if (category.key === "category") {
            return Alert.alert("Selecione a categoria");
        }

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date(),
            period: format(new Date(), "MMMM/yyyy", { locale: ptBR }),
        };

        try {
            const dataKey = `@EasyFlux:transactions_user:${user.id}`;
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormatted = [...currentData, newTransaction];

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));
            reset();
            setTransactionType("");
            setCategory({
                key: "category",
                name: "Categoria",
            });
            navigate("Listagem");
        } catch (error) {}
    }

    return (
        <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            containerStyle={{ flex: 1 }}
            style={{ flex: 1 }}
        >
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