// AuthContext.tsx
import { createContext, useContext } from "react";

export interface AuthContextType {
    user: any;
    token: string | null;
    login: (userData: any, userToken: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth muss innerhalb eines AuthProvider verwendet werden");
    }
    return context;
}