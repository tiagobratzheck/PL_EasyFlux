import React from "react";
import { FlatList } from "react-native";
import { Button } from "../../components/Forms/Button";
import { categoriesOutcome, categoriesIncome } from "../../utils/categories";

import {
    Container,
    Header,
    Title,
    Category,
    Icon,
    Name,
    Separator,
    Footer,
} from "./styles";

interface Category {
    key: string;
    name: string;
}

interface CategoryProps {
    category: Category;
    setCategory: (category: Category) => void;
    closeSelectCategory: () => void;
    transactionType: string;
    listCategoriesNotSelectable?: string[];
}

let categoriesSelectable = [];

export function CategorySelect({
    category,
    setCategory,
    closeSelectCategory,
    transactionType,
    listCategoriesNotSelectable = [],
}: CategoryProps) {
    categoriesSelectable =
        transactionType === "negative" ? categoriesOutcome : categoriesIncome;

    if (listCategoriesNotSelectable.length > 0) {
        categoriesSelectable = categoriesSelectable.filter(
            (item) => !listCategoriesNotSelectable.includes(item.key)
        );
    }
    function handleCategorySelect(category: Category) {
        setCategory(category);
    }

    return (
        <Container>
            <Header>
                <Title>Categoria</Title>
            </Header>
            <FlatList
                data={categoriesSelectable}
                keyExtractor={(item) => item.key}
                style={{}}
                renderItem={({ item }) => (
                    <Category
                        onPress={() => handleCategorySelect(item)}
                        isActive={category.key === item.key}
                    >
                        <Icon name={item.icon} />
                        <Name>{item.name}</Name>
                    </Category>
                )}
                ItemSeparatorComponent={() => <Separator />}
            />
            <Footer>
                <Button title="Selecionar" onPress={closeSelectCategory} />
            </Footer>
        </Container>
    );
}
