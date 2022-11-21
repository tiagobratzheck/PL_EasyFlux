import React, { createContext, ReactNode, useContext, useState } from "react";
import { addMonths, subMonths } from "date-fns";

interface DateProviderProps {
    children: ReactNode;
}

interface DateContextData {
    dateTransactions: Date;
    changeDateTransactions(action: "next" | "prev"): void;
}

const DateContext = createContext({} as DateContextData);

function DateProvider({ children }: DateProviderProps) {
    const [dateTransactions, setDateTransactions] = useState<Date>(new Date());

    function changeDateTransactions(action: "next" | "prev") {
        if (action === "next") {
            const newDate = addMonths(dateTransactions, 1);
            setDateTransactions(newDate);
        } else {
            const newDate = subMonths(dateTransactions, 1);
            setDateTransactions(newDate);
        }
    }

    return (
        <DateContext.Provider
            value={{
                dateTransactions,
                changeDateTransactions,
            }}
        >
            {children}
        </DateContext.Provider>
    );
}

function useDate() {
    const context = useContext(DateContext);

    return context;
}

export { DateProvider, useDate };
