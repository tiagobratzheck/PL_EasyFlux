import { Image } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

interface sizeProps {
    size: "small"|"big"
}

export const Container = styled(GestureHandlerRootView)`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
    justify-content: space-between;
    align-items: center;
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
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(13)}px;
    color: ${({ theme }) => theme.colors.shape};
`;

export const Footer = styled.View`
    width: 100%;
    padding: 24px;
`;

export const ImageContainer = styled.View`
    width: 100%;
    height: 80%;   
`;

export const EmptyPhotoContainer = styled.View`
    width: 270px;
    height: 270px;
    border-width: 3px;
    border-radius: 5px;
    border-color: ${({ theme }) => theme.colors.text};
    border-style: dashed;
    justify-content: center;
    align-items: center;
`;

export const ImageBox = styled(Image)`
    width: 100%;
    height: 80%;
    border-radius: 5px;
`;

export const EmptyPhotoText = styled.Text`
    font-size: 18px;
    font-family: ${({ theme }) => theme.fonts.regular};
    color: ${({ theme }) => theme.colors.text};
    text-align: center;
    padding-top: 18px;
    padding-bottom: 18px;
`;