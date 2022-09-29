import React from "react";

import AppleSvg from "../../assets/apple.svg";
import GoogleSvg from "../../assets/google.svg";

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
import { SignInSocialButton } from "../../components/SignInSocialButton";
import { useAuth } from "../../hooks/auth";
import { Alert } from "react-native";

export function SignIn() {
    const { signInWithGoogle } = useAuth();

    async function handleSignInWithGoogle() {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.log(error);
            Alert.alert("Não foi possível conectar a conta Google");
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
                        title="Entrar com Apple"
                        svg={AppleSvg}
                    />
                </FooterWrapper>
            </Footer>
        </Container>
    );
}
