import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../../ShopContext"
import type { BuyerEntity } from "../../../../generated-ts/models"
import { Link, useNavigate } from "react-router-dom"

type Buyer = {BuyerEntity: BuyerEntity}

function ItemShop() {
    const {koszyk, shopInfo} = useContext(ShopContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (shopInfo?.token === undefined || koszyk.length < 1) {
            navigate("/refresh")
            return
        }
        navigate("buyer")
    }, [])

    return(<></>)
}

export default ItemShop