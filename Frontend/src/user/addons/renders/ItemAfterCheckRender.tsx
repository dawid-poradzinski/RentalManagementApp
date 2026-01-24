import { useContext, type SetStateAction } from "react"
import { ShopContext, type ItemInKoszyk } from "../../ShopContext"
import { IconXboxX } from "@tabler/icons-react"

type Props = {item: ItemInKoszyk, valid: boolean, setValid: React.Dispatch<React.SetStateAction<ItemInKoszyk[] | undefined>>}

function ItemAfterCheckRender(props: Props) {

    const {removeFromKoszyk} = useContext(ShopContext)

    function deleteFromKoszykAndValid() {
        removeFromKoszyk(props.item.id)
        props.setValid(prev => prev!.filter(x => x.id !== props.item.id))
    }

    return(
        <div className="group relative w-full h-full flex shadow-xl rounded-xl backdrop-blur-xl flex flex-col border border-white bg-[url(/Background.png)]  overflow-hidden">
            <div className={"absolute left-2 top-2 text-3xl"}>
                {props.item.size}
            </div>
            { props.valid ? (<IconXboxX onClick={deleteFromKoszykAndValid} size={32} color="red" className={"absolute right-2 top-2 rounded-xl cursor-pointer transition-transform transform hover:-translate-y-1"} />) : (<></>)}
            <div className="w-fit h-fit w-full h-full flex justify-center py-4 rounded-t-xl bg-center-left">
                <img src={props.item.image} className="h-24"></img>
            </div>
            <div className="p-2 flex flex-col gap-2 bg-linear-to-b from-white/85 to-white/50">
                <div className="text-center font-bold text-lg">
                    {props.item.name}
                </div>
                <div className="text-center">
                    <span className="text-xl font-bold">
                        {props.item.price?.priceAmount} {props.item.price?.priceCurrency}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ItemAfterCheckRender