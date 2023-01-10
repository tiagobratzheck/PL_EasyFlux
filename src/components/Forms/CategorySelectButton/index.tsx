import React from "react";

import { Category, Container, Icon } from "./styles";

interface Props {
    size?: string
    title: string;
    onPress: () => void;
}

export function CategorySelectButton({ size="big", title, onPress }: Props) {
    return (
        <Container size={size} onPress={onPress}>
            <Category>{title}</Category>
            <Icon name="chevron-down"></Icon>
        </Container>
    );
}
