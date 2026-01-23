import { createContext, useContext, useState } from "react"
import type { PlacesEnum, Price, RentalDate, SizeEnum } from "../../generated-ts/models"

interface ShopContextType  {
    koszyk: ItemInKoszyk[]
    shopInfo: ShopInfo | null
    addToKoszyk: (item: ItemInKoszyk) => Promise<void>
    changeKoszyk: (items: ItemInKoszyk[]) => Promise<void>
    removeFromKoszyk: (id: number) => Promise<void>
    clearKoszyk: () => Promise<void>
    updateShopInfo: (shopInfo: ShopInfo) => Promise<void>
    setToken: (token: string) => Promise<void>
}

export interface ShopInfo {
    date: RentalDate
    place: PlacesEnum
    token: string | undefined
}

export interface ItemInKoszyk {
    id: number
    name: string
    size: SizeEnum
    image: string
    price: Price
}

export const ShopContext = createContext<ShopContextType>({
    koszyk: [],
    addToKoszyk: async () => {},
    changeKoszyk: async () => {},
    removeFromKoszyk: async () => {},
    clearKoszyk: async () => {},
    shopInfo: null,
    updateShopInfo: async () => {},
    setToken: async () => {}
}) 

function ShopProvider( {children} : { children: React.ReactNode } ) {
    const [koszyk, setKoszyk] = useState<ItemInKoszyk[]>([])
    const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null)

    async function changeKoszyk(items: ItemInKoszyk[]) {
        setKoszyk(items)
    }

    async function addToKoszyk(item: ItemInKoszyk) {
        setKoszyk(prev => [...prev, item])
    }

    async function removeFromKoszyk(id: number) {
         setKoszyk(prev => prev.filter(x => x.id !== id))
    }

    async function clearKoszyk() {
        setKoszyk([])
    }

    async function setToken(token: string) {
        const newShopInfo: ShopInfo = {
            date: shopInfo?.date!,
            place: shopInfo?.place!,
            token: token
        }
        setShopInfo(newShopInfo)
    }

    async function updateShopInfo(update: ShopInfo) {
     
        if (JSON.stringify(update.date) !== JSON.stringify(shopInfo?.date)) {
            clearKoszyk()
        }

        if (JSON.stringify(update.place) !== JSON.stringify(shopInfo?.place)) {
            clearKoszyk()
        }
     
        setShopInfo(update)
    }

    return (
        <ShopContext.Provider value={ {koszyk, addToKoszyk, changeKoszyk, removeFromKoszyk, clearKoszyk, shopInfo, updateShopInfo, setToken} }>
            {children}
        </ShopContext.Provider>
    )
}

export default ShopProvider

export function useShop() {
    return useContext(ShopContext)
}