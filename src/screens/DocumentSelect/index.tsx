import * as ImagePicker from 'expo-image-picker';
import React from "react";
import { TouchableOpacity } from 'react-native';
import { Button } from "../../components/Forms/Button";
import { Container, EmptyPhotoContainer, EmptyPhotoText, Footer, Header, ImageBox, ImageContainer, Title } from "./styles";

interface DocumentSelectProps{
    setDocument: (url : string) => void;
    document: string;
    setItHasDocAttached: (docAttach : boolean) => void;
    closeDocumentSelect: () => void;
}

export function DocumentSelect({setDocument, document, setItHasDocAttached, closeDocumentSelect}: DocumentSelectProps){

    async function handlePickImage() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (status == 'granted') {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [4, 4],
                quality: 1,
            });    
            if (!result.cancelled) {
                setDocument(result.uri);     
                setItHasDocAttached(true);       
            }
        }
    };
        
    return <Container>
                <Header>
                    <Title>Anexo de comprovante</Title>
                </Header>   
                <TouchableOpacity onPress={handlePickImage}>
                    <ImageContainer>
                        { document !== '' ? <ImageBox source={{uri: document}}/> : (
                            <EmptyPhotoContainer>
                                <EmptyPhotoText>
                                    Clique aqui para adicionar
                                </EmptyPhotoText>
                            </EmptyPhotoContainer >
                            )
                        }                        
                    </ImageContainer>
                </TouchableOpacity>
                <Footer>
                    <Button title="Voltar" onPress={closeDocumentSelect} />
                </Footer>     
            </Container>
}