import { useContext, useEffect, useState } from "react";
import type { ItemEntity } from "../../../../generated-ts/models";
import { ShopContext } from "../../ShopContext";

type Props = {item: ItemEntity}

function RefreshItemRender(props: Props) {

    
    const {koszyk, addToKoszyk, removeFromKoszyk} = useContext(ShopContext)
    const [selected, setSelected] = useState<boolean>()

    useEffect(() => {
        setSelected(koszyk.some(k => k.id === props.item.id))
    }, [koszyk])

    function select() {
        if (selected) {
            removeFromKoszyk(props.item.id)
            setSelected(false)
        } else {
            addToKoszyk({id: props.item.id, image: props.item.image, name: props.item.name, price: props.item.price, size: props.item.size})
            setSelected(true)
        }
    }

    return(
        <div onClick={select} className="group relative w-full h-full flex shadow-xl rounded-xl bg-[url(/Background.png)] backdrop-blur-xl flex flex-col cursor-pointer transition-transform transform hover:-translate-y-1 border border-white overflow-hidden">
            <div className={"absolute right-2 top-2 rounded-xl w-5 h-5 border " + (selected ? "bg-sky-500 group-hover:bg-transparent" : "group-hover:bg-sky-500 ")}>
                
            </div>
            <div className="w-fit h-fit w-full h-full flex justify-center py-4 rounded-t-xl">
                <img src={props.item.image} className="h-32"></img>
            </div>
            <div className="p-2 flex flex-col gap-2 bg-linear-to-b from-white/85 to-white/50">
                <div className="text-center font-bold">
                    {props.item.name}
                </div>
                <div className="text-center">
                    <span>
                        {"from: "}
                    </span>
                    <span className="text-xl font-bold">
                        {props.item.price?.priceAmount} {props.item.price?.priceCurrency}
                    </span>
                </div>
                <div className="bg-white w-5/6 mx-auto rounded-xl shadow-xl backdrop-blur-xl p-1 flex">
                    <div className="w-full border-r text-center">
                        {props.item.place}
                    </div>
                    <div className="w-fit px-4 text-center flex items-center">
                        {props.item.size}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RefreshItemRender