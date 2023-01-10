import React from "react";
import { TouchableOpacity } from 'react-native';
import { Button } from "../../components/Forms/Button";
import { Container, EmptyPhotoContainer, EmptyPhotoText, Footer, Header, ImageContainer, Title } from "./styles";

interface DocumentSelectProps{
    setDocument: (url : string) => void;
    closeDocumentSelect: () => void;
}

export function DocumentSelect({setDocument, closeDocumentSelect}: DocumentSelectProps){
    return <Container>
                <Header>
                    <Title>Anexo de comprovante</Title>
                </Header>   
                <TouchableOpacity>
                    <ImageContainer>
                        <EmptyPhotoContainer>
                            <EmptyPhotoText>
                                Clique aqui para adicionar
                            </EmptyPhotoText>
                        </EmptyPhotoContainer >
                    </ImageContainer>
                </TouchableOpacity>
                <Footer>
                    <Button title="Voltar" onPress={closeDocumentSelect} />
                </Footer>     
            </Container>
}