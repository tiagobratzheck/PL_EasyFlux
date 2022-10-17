import React from "react";
import { View } from "react-native";
import { commonCategories } from "../../utils/categories";

import { isEqual, isAfter } from "date-fns";

import {
    Container,
    Description,
    DeleteRegister,
    DeleteIcon,
    Title,
    Amount,
    Footer,
    Category,
    Icon,
    CategoryName,
    DisplayDate,
} from "./styles";

interface Category {
    name: string;
    //key: string;
    icon: string;
}

export interface TransactionCardProps {
    id: string;
    entryType: "actual" | "budget";
    name: string;
    amount: string;
    category: string;
    date: string;
    period: string;
    type: "positive" | "negative";
}

interface Props {
    data: TransactionCardProps;
    selectedDate: Date;
}

export function TransactionCard({ data, selectedDate }: Props) {
    const category = commonCategories.filter(
        (item) => item.key === data.category
    )[0];

    return (
        <Container>
            <Description>
                <Title>{data.name}</Title>
                {new Date().getMonth() === selectedDate.getMonth() &&
                new Date().getFullYear() === selectedDate.getFullYear() ? (
                    <DeleteRegister
                        onPress={() => {
                            console.log(data.id);
                        }}
                    >
                        <DeleteIcon name="delete" />
                    </DeleteRegister>
                ) : null}
            </Description>
            <Amount type={data.type}>
                {data.type === "negative" && "-"}
                {data.amount}
            </Amount>
            <Footer>
                <Category>
                    <Icon name={category.icon} />
                    <CategoryName>{category.name}</CategoryName>
                </Category>
                <DisplayDate>{data.date}</DisplayDate>
            </Footer>
        </Container>
    );
}
