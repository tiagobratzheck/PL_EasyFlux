import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";
import { BorderlessButton } from "react-native-gesture-handler";

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
`;

export const LoadContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
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

export const TitleList = styled.Text`
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(11)}px;
`;

export const TransactionsTypeSelectable = styled.ScrollView.attrs({
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: { paddingHorizontal: 24 },
})``;

export const Content = styled.View`
    flex: 1%;
    padding: 0 24px;
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

export const Form = styled.View`
    width: 100%;
    padding: 10px 24px;
    justify-content: flex-start;
`;

export const Fields = styled.View`
    margin-bottom: 10px;
    margin-top: 10px;
`;

export const TransactionsTypes = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-top: 5px;
`;
