import React from "react";
import { View } from "react-native";
import { commonCategories } from "../../utils/categories";

import {
    Container,
    Title,
    Amount,
    Footer,
    Category,
    Icon,
    CategoryName,
    Date,
} from "./styles";

interface Category {
    name: string;
    //key: string;
    icon: string;
}

export interface TransactionCardProps {
    name: string;
    amount: string;
    category: string;
    date: string;
    type: "positive" | "negative";
}

interface Props {
    data: TransactionCardProps;
}

export function TransactionCard({ data }: Props) {
    const category = commonCategories.filter(
        (item) => item.key === data.category
    )[0];

    return (
        <Container>
            <Title>{data.name}</Title>
            <Amount type={data.type}>
                {data.type === "negative" && "-"}
                {data.amount}
            </Amount>
            <Footer>
                <Category>
                    <Icon name={category.icon} />
                    <CategoryName>{category.name}</CategoryName>
                </Category>
                <Date>{data.date}</Date>
            </Footer>
        </Container>
    );
}
