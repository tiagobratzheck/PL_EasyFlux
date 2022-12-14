import { Feather } from "@expo/vector-icons";
import { BorderlessButton } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
    justify-content: flex-start;
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

export const Content = styled.ScrollView`
    flex: 1;
`;

export const ChartContainer = styled.View`
    width: 100%;
    align-items: center;
`;

export const MonthSelect = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-evenly;
    align-content: center;
    margin-top: 20px;
`;

export const MonthSelectButton = styled(BorderlessButton)`
    justify-content: center;
`;

export const MonthSelectIcon = styled(Feather)`
    font-size: ${RFValue(20)}px;
`;

export const Month = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(15)}px;
`;

export const LoadContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

export const Form = styled.View`
    width: 100%;
    margin-top: 14px;
    padding: 0px 24px 10px;
    justify-content: space-evenly;
`;

export const TransactionsTypes = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

export const Totalizador = styled.View`    
    padding: 20px;
    flex-direction: row;
    justify-content: space-between;
`

export const TitleAmount = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(15)}px;
`

export const Amount = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(15)}px;
`;
