import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

interface IconProps {
    itHasDocAttached: boolean
}

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
    background-color: ${({ theme }) => theme.colors.primary};
    width: 100%;
    height: ${RFValue(60)}px;
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 19px;
`;

export const Title = styled.Text`
    color: ${({ theme }) => theme.colors.shape};
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(13)}px;
`;

export const Form = styled.View`
    flex: 1;
    width: 100%;
    padding: 24px;
    justify-content: space-between;
`;

export const Fields = styled.View``;

export const TransactionsTypes = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-top: 8px;
    margin-bottom: 16px; ;
`;

export const AttachmentContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
`

export const Attachment = styled(RectButton).attrs({
    activeOpacity: 0.9,
    borderless: false,
})`        
    justify-content: center;
`;

export const Icon = styled(MaterialCommunityIcons)<IconProps>`    
    font-size: ${RFValue(40)}px;
    color: ${({theme, itHasDocAttached}) => 
        itHasDocAttached === true ? theme.colors.secondary : theme.colors.text };
`;
