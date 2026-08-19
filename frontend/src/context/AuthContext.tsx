// AuthContext.tsx
import { createContext } from "react";

export interface AuthContextType {
    user: any;
    token: string | null;
    login: (userData: any, userToken: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);