import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";
import theme from "../../global/styles/theme";

interface HeaderTableProps {
    color: string;
}

interface TypeResultProps {
    amount: string;
}

export const Container = styled(GestureHandlerRootView)`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
    justify-content: space-between;
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

export const Footer = styled.View`
    width: 100%;
    padding: 24px;
`;

export const LoadContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    margin-top: 60px;
`;

export const HistoryContainer = styled.View`
    width: 100%;
    flex: 1;
`;

export const DisplayData = styled.ScrollView`
    flex: 1; 
`

export const TitleGraph = styled.Text`
    padding: 20px;
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(15)}px;
    color: ${({ theme }) => theme.colors.text};
`;

export const HeaderWrapper = styled.View`
    padding-left: 24px;
    padding-right: 24px;
`;

export const HeaderTable = styled.View<HeaderTableProps>`
    width: 100%;
    background-color: ${({ theme }) => theme.colors.shape};
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-radius: 5px;
    padding: 14px;
    border-width: 1px;
    border-color: ${({ color }) => color};
`;

export const DescriptionHeaderCell = styled.Text`
    font-size: ${RFValue(10)}px;
    font-family: ${({ theme }) => theme.fonts.regular};
`;

export const Description = styled.Text`
    font-size: ${RFValue(9)}px;
    font-family: ${({ theme }) => theme.fonts.regular};
    width: 27%;
`;

export const DescriptionResult = styled.Text<TypeResultProps>`
    font-size: ${RFValue(9)}px;
    font-family: ${({ theme }) => theme.fonts.regular};
    color: ${({ amount }) =>
        amount.split("")[0] === "-"
            ? theme.colors.attention
            : theme.colors.primary};
`;

export const CellWrapper = styled.View`
    padding-left: 24px;
    padding-right: 24px;
`;

export const CellTable = styled.View`
    width: 100%;
    background-color: ${({ theme }) => theme.colors.shape};
    flex-direction: row;
    align-items: center;
    padding: 10px;
`;
