import React, { useState } from "react";
import { Keyboard, Modal, Alert } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import firestore from "@react-native-firebase/firestore";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {
    useNavigation,
    NavigationProp,
    ParamListBase,
} from "@react-navigation/native";

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
    const [isSaving, setIsSaving] = useState(true);
    const [transactionType, setTransactionType] = useState("positive");
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
        setIsSaving(false);
        if (!transactionType) {
            return Alert.alert("Selecione o tipo do lançamento");
        }

        if (category.key === "category") {
            return Alert.alert("Selecione a categoria");
        }

        const newTransaction = {
            entryType: "actual",
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date(),
            period: format(new Date(), "MMMM/yyyy", { locale: ptBR }),
        };

        firestore()
            .collection(`@EasyFlux:transactions_user:${user.id}`)
            .add(newTransaction)
            .then(() => {
                Alert.alert(
                    "Solicitação",
                    "Solicitação registrada com sucesso."
                );
                reset();
                setTransactionType("");
                setIsSaving(true);
                setCategory({
                    key: "category",
                    name: "Categoria",
                });
                navigate("Listagem");
            })
            .catch((error) => {
                console.log(error);
                return Alert.alert(
                    "Solicitação",
                    "Não foi possível registrar o pedido"
                );
            });
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
                                    setCategory({
                                        key: "category",
                                        name: "Categoria",
                                    });
                                }}
                                isActive={transactionType === "positive"}
                            />
                            <TransactionTypeButton
                                type="down"
                                title="Saída"
                                onPress={() => {
                                    handleTransactionsType("negative");
                                    setCategory({
                                        key: "category",
                                        name: "Categoria",
                                    });
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
                        title={isSaving ? "Lançar" : "Salvando..."}
                        onPress={handleSubmit(handleRegister)}
                        enabled={isSaving}
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
