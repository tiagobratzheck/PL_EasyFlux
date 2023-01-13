import firestore from "@react-native-firebase/firestore";
import React from "react";
import { Alert, Modal } from "react-native";
import { commonCategories } from "../../utils/categories";

import { useAuth } from "../../hooks/auth";
import { DocumentViewer } from "../../screens/DocumentViewer";
import {
    Amount, Category, CategoryName, Container, DeleteIcon, DeleteRegister, Description, DisplayDate,
    DocumentAttached, DocumentIcon, Footer, Icon, IconsBox, Title
} from "./styles";

interface Category {
    name: string;
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
    hasDocument?: true | false;
}

interface Props {
    data: TransactionCardProps;
    selectedDate: Date;
}

export function TransactionCard({ data, selectedDate }: Props) {

    const [documentId, setDocumentId] = React.useState('');
    const [documentAttachedModalOpen, setDocumentAttachedModalOpen] = React.useState(false);
    const { user } = useAuth();

    const category = commonCategories.filter(
        (item) => item.key === data.category
    )[0];

    const dateFormatted = Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    }).format(new Date(data.date));

    function handleOpenDocumentAttached(id:string){
        setDocumentId(id);
        setDocumentAttachedModalOpen(true)
    }

    function handleCloseDocumentAttached(){
        setDocumentAttachedModalOpen(false)
    }

    function deleteEntry(id: string) {
        Alert.alert("Atenção!", "Deseja realmente deletar esse lançamento?", [
            {
                text: "Cancelar",
                onPress: () => {},
            },
            {
                text: "Deletar",
                onPress: () =>
                    firestore()
                        .collection(`@EasyFlux:transactions_user:${user.id}`)
                        .doc(id)
                        .delete()
                        .then(() => {
                            Alert.alert("Lançamento deletado!");
                        }),
            },
        ]);
    }
    
    return (        
        <Container>
            <Description>
                <Title>{data.name}</Title>
                <IconsBox>
                    {
                        data.hasDocument && data.hasDocument === true ? (
                            <DocumentAttached onPress={() => { handleOpenDocumentAttached(data.id) }}>
                                <DocumentIcon name="file-text"></DocumentIcon>
                            </DocumentAttached> 
                            ) : null
                    }                    
                    {new Date().getMonth() === selectedDate.getMonth() &&
                    new Date().getFullYear() === selectedDate.getFullYear() ? (
                        <DeleteRegister
                            onPress={() => {
                                deleteEntry(data.id);
                            }}
                        >
                            <DeleteIcon name="delete" />
                        </DeleteRegister>
                    ) : null}
                </IconsBox>
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
                <DisplayDate>{dateFormatted}</DisplayDate>
            </Footer>
            <Modal visible={documentAttachedModalOpen}>
                <DocumentViewer 
                    id_document={documentId} 
                    closeDocumentViewer={handleCloseDocumentAttached} />                
            </Modal>
        </Container>
    );
}
