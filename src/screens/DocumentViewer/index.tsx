import storage from '@react-native-firebase/storage';
import React from "react";
import { ActivityIndicator } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useTheme } from 'styled-components';
import { Button } from "../../components/Forms/Button";
import { useAuth } from '../../hooks/auth';
import { Container, Footer, Header, ImageContainer, LoadContainer, Title } from "./styles";

interface DocumentViewerProps{    
    id_document: string;  
    closeDocumentViewer: () => void; 
}

export function DocumentViewer({id_document, closeDocumentViewer}: DocumentViewerProps){

    const [loading, setLoading] = React.useState(true);
    const [image, setImage] = React.useState('');
    const { user } = useAuth();
    const theme = useTheme();

    React.useEffect(() => {
            const fetchDocument = async() =>{
                const urlImage = await storage().ref(
                    `/images/@EasyFlux:documents_user:${user.id}/${id_document}`).getDownloadURL();
                setImage(urlImage)
                setLoading(false)
            }
            fetchDocument()
    },[])
            
    return <Container>
                <Header>
                    <Title>Comprovante anexado</Title>
                </Header>       
                { loading ? (
                    <LoadContainer>
                        <ActivityIndicator
                            size={"large"}
                            color={theme.colors.primary}
                        />
                    </LoadContainer> ):(        
                    <ImageContainer>
                        { 
                            //<ImageBox source={{uri: image}}/>  
                        }             
                        <ImageViewer imageUrls={[{url: image}]}/>                                                
                    </ImageContainer>)
                }
                <Footer>
                    <Button title="Voltar" onPress={closeDocumentViewer} />
                </Footer>     
            </Container>
}