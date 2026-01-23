import { createContext, useContext, useState } from "react"
import type { Price, RentalDate } from "../../generated-ts/models"

interface ShopContextType  {
    koszyk: ItemInKoszyk[]
    addToKoszyk: (item: ItemInKoszyk) => Promise<void>
    removeFromKoszyk: (id: number) => Promise<void>
    clearKoszyk: () => Promise<void>
    date: RentalDate | null
    initDate: (date: RentalDate) => Promise<void>
    token: string | null

}

interface ItemInKoszyk {
    id: number
    name: string
    image: string
    price: Price
}

export const ShopContext = createContext<ShopContextType>({
    koszyk: [],
    addToKoszyk: async () => {},
    removeFromKoszyk: async () => {},
    clearKoszyk: async () => {},
    date: null,
    initDate: async () => {},
    token: null
}) 

function ShopProvider( {children} : { children: React.ReactNode } ) {
    const [koszyk, setKoszyk] = useState<ItemInKoszyk[]>([])
    const [date, setDate] = useState<RentalDate | null>(null)
    const [token, setToken] = useState<string | null>(null)

    async function addToKoszyk(item: ItemInKoszyk) {
        setKoszyk(prev => [...prev, item])
    }

    async function removeFromKoszyk(id: number) {
         setKoszyk(prev => prev.filter(x => x.id !== id))
    }

    async function clearKoszyk() {
        setKoszyk([])
    }

    async function initDate(newDate: RentalDate) {
        if (JSON.stringify(date) !== JSON.stringify(newDate)) {
            clearKoszyk()
            setDate(newDate)
        }
    }

    return (
        <ShopContext.Provider value={ {koszyk, addToKoszyk, removeFromKoszyk, clearKoszyk, date, initDate, token} }>
            {children}
        </ShopContext.Provider>
    )
}

export default ShopProvider

export function useShop() {
    return useContext(ShopContext)
}