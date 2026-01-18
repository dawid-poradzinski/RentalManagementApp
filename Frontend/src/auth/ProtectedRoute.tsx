import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import type { RankEnum } from "../../generated-ts/models"

type Props = {children: React.ReactNode, ranks: RankEnum[]}

function ProtectedRoute(props: Props) {
    const {user} = useAuth()

    console.log(user)

    if (!user) {
        return <Navigate to="/auth/login" replace />
    }

    if (props.ranks.length != 0 && user.rank && !props.ranks.includes(user.rank)) {
        return <Navigate to="/403" replace />
    }

    return props.children
}

export default ProtectedRoute