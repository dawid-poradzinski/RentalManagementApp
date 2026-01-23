import { useContext } from "react"
import { ShopContext } from "../ShopContext"

function ItemCheck() {

    const {koszyk} = useContext(ShopContext)

    return(
        <div>
            {koszyk.length}
        </div>
    )
}

export default ItemCheck