import { RectButton } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

interface colorButton{
    themeColor: "secondary" | "light";
}

export const ContainerView = styled.View<colorButton>`
    border-width: ${({themeColor}) => themeColor === 'light' ? '1px' : '0px' };
    border-color: ${({ theme }) => theme.colors.secondary};
    border-radius: 5px;   
    margin-bottom: 12px;
`

export const Container = styled(RectButton)<colorButton>`
    width: 100%;  
    background-color: ${({ themeColor, theme }) => 
        themeColor === 'secondary' ? theme.colors.secondary : theme.colors.shape};
    border-radius: 5px;    
    align-items: center;
    padding: 12px;    
`;

export const Title = styled.Text<colorButton>`
    font-family: ${({ theme }) => theme.fonts.medium};
    color: ${({ themeColor, theme }) => 
        themeColor === 'secondary' ? theme.colors.shape : theme.colors.secondary};
    font-size: ${RFValue(12)}px;
`;
