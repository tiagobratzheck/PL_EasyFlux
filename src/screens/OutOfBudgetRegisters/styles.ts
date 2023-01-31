import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";

import styled from "styled-components/native";

interface ContainerProps {
    color: string;
}

export const Container = styled(GestureHandlerRootView)`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
    justify-content: space-between;
`;

export const LoadContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

export const Header = styled.View`
    width: 100%;
    height: ${RFValue(60)}px;
    background-color: ${({ theme }) => theme.colors.primary};
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 19px;
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(13)}px;
    color: ${({ theme }) => theme.colors.shape};
`;

export const TitleList = styled.Text`
    margin-top: 10px;
    padding-left: 24px;
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(13)}px;
    color: ${({ theme }) => theme.colors.text};
`;

export const Footer = styled.View`
    width: 100%;
    padding: 24px;
`;

export const Cards = styled.View`
    justify-content: flex-start;
`

export const ListEntries = styled.View`
    height: 40%;
`

export const VisualCards = styled.View`    
    flex-direction: row;
    margin-top: 10px;
    padding-left: 24px;
    padding-right: 24px;
    justify-content: space-between;
`;

export const ContainerCard = styled.View<ContainerProps>`
    width: 47%;
    height: 80px;
    background-color: ${({ theme }) => theme.colors.shape};
    flex-direction: column;    
    justify-content: space-between;
    border-radius: 5px;
    border-left-width: 6px;
    border-left-color: ${({ color }) => color};
    margin-bottom: 9px;
    padding: 5px;
`;

export const TitleCard = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(13)}px;
`;

export const FooterCard = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

export const AmountCard = styled.Text`
    font-family: ${({ theme }) => theme.fonts.bold};
    font-size: ${RFValue(12)}px;
`;

export const PercentCard = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(9)}px;
`

export const CategoryEntry = styled.View` 
    padding: 12px 24px 12px 24px; 
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: ${({ theme }) => theme.colors.background};
`;

export const Description = styled.View`
    flex-direction: row;
`;

export const Icon = styled(MaterialCommunityIcons)`
    font-size: ${RFValue(18)}px;
    margin-right: 16px;
`;

export const NameEntry = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(13)}px;   
`;

export const AmountEntry = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(13)}px; 
`;

export const Separator = styled.View`
    height: 0px;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.title};
`;