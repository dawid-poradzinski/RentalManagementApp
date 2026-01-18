import { createContext, useContext, useEffect, useState } from "react";
import { AuthApi } from "../../generated-ts/apis/AuthApi";
import { Configuration } from "../../generated-ts/runtime";
import type { PersonEntity } from "../../generated-ts/models";

interface AuthContextType {
    user: PersonEntity | null
    refreshUser: () => Promise<void>
    logoutUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    refreshUser: async () => {},
    logoutUser: async () => {}
})

function AuthProvider( {children} : { children: React.ReactNode }) {
    const [user, setUser] = useState<PersonEntity | null>(null)

    const api = new AuthApi(new Configuration({
        credentials: "include"
    }))

    async function refreshUser() {
        try {
            const me = await api.v1ApiMeGet()
            console.log(me)
            setUser(me.user)
        } catch {
            setUser(null)
        }
    }

    async function logoutUser() {
        if (user) {
            try {
                await api.v1ApiLogoutPost()
                setUser(null)
            } catch (error) {
                
            }
        }
    }

    useEffect(() => {
        refreshUser()
    }, [])

    return (
        <AuthContext.Provider value={ {user, refreshUser, logoutUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider

export function useAuth() {
    return useContext(AuthContext)
}