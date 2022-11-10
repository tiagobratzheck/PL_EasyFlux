import React from "react";
import { SignInSocialButton } from "../../components/SignInSocialButton";
import { useAuth } from "../../hooks/auth";
import { Alert, ActivityIndicator, Platform } from "react-native";
import { useTheme } from "styled-components";

import AppleSvg from "../../assets/apple.svg";
import GoogleSvg from "../../assets/icons8-google32.svg";
import FacebookSvg from "../../assets/icons8-facebook32.svg";

import {
    Container,
    Image,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper,
} from "./styles";

export function SignIn() {
    const [isLoading, setIsLoading] = React.useState(false);
    const {
        signInWithGoogleRequest,
        signInWithFacebookRequest,
        signInWithApple,
    } = useAuth();
    const theme = useTheme();

    async function handleSignInWithGoogle() {
        try {
            setIsLoading(true);
            return await signInWithGoogleRequest();
        } catch (error) {
            console.log(error);
            Alert.alert("Não foi possível conectar a conta Google");
            setIsLoading(false);
        }
    }

    async function handleSignInWithFacebook() {
        try {
            setIsLoading(true);
            return await signInWithFacebookRequest();
        } catch (error) {
            console.log(error);
            Alert.alert("Não foi possível conectar a conta Facebook");
            setIsLoading(false);
        }
    }

    async function handleSignInWithApple() {
        try {
            setIsLoading(true);
            return await signInWithApple();
        } catch (error) {
            console.log(error);
            Alert.alert("Não foi possível conectar a conta Apple");
            setIsLoading(false);
        }
    }

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <Image source={require("../../assets/EasyFlux.png")} />
                    <Title>Controle e orçamento {"\n"} na palma da mão</Title>
                </TitleWrapper>
                <SignInTitle>Faça seu login com uma das contas</SignInTitle>
            </Header>
            <Footer>
                <FooterWrapper>
                    <SignInSocialButton
                        title="Entrar com Google"
                        svg={GoogleSvg}
                        onPress={handleSignInWithGoogle}
                    />
                    <SignInSocialButton
                        title="Entrar com Facebook"
                        svg={FacebookSvg}
                        onPress={handleSignInWithFacebook}
                    />
                    {Platform.OS === "ios" ? (
                        <SignInSocialButton
                            title="Entrar com Apple"
                            svg={AppleSvg}
                            onPress={handleSignInWithApple}
                        />
                    ) : null}
                </FooterWrapper>
                {isLoading && (
                    <ActivityIndicator
                        color={theme.colors.shape}
                        style={{ marginTop: 18 }}
                    />
                )}
            </Footer>
        </Container>
    );
}
