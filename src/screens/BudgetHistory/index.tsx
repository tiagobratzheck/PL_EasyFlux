import React from "react";
import { Container } from "./styles";

interface BudgetHistoryProps{
    transactionDate: Date;
}

export function BudgetHistory({transactionDate}: BudgetHistoryProps) {

    React.useEffect(() => {

        // variável transactionDate - 6 meses;
        // função de seleção para trazer todos os dados dentro do range de seis meses

        // separar o budget 
        // agrupar o budget pelos meses 
           // somar todas as entradas 
           // somar todas as saídas
           // calcular o resultado

           // {
           //     [ period: xxxxx, quarter: x, entradas: xxxxx, saídas: xxxxx, resultado: xxxxx],
           // }

        // separar o actual 
        // agrupar actuals pelos meses
           // somar todas as entradas 
           // somar todas as saídas
           // calcular o resultado

           // {
           //     [ period: xxxxx, quarter: x, entradas: xxxxx, saídas: xxxxx, resultado: xxxxx],
           // }

        // Lista com as datas para usar nos gráficos

    }, [])

    return <Container></Container>;
}
