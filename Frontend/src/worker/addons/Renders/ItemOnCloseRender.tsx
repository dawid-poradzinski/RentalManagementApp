import type { ItemForRental } from "../../../../generated-ts/models"

type Props = {item: ItemForRental}

function ItemOnCloseRender(props: Props) {
    return(
        <div className="group relative w-full h-fit flex shadow-xl rounded-xl backdrop-blur-xl flex flex-col border border-white bg-[url(/Background.png)]  overflow-hidden">
            <div className={"absolute left-2 top-2 text-3xl"}>
                {props.item.item.id}
            </div>
            <div className="w-fit h-fit w-full h-full flex justify-center py-4 rounded-t-xl bg-center-left">
                <img src={props.item.item.image} className="h-24"></img>
            </div>
            <div className="p-2 flex flex-col gap-2 bg-linear-to-b from-white/85 to-white/50">
                <div className="text-center font-bold text-lg">
                    {props.item.item.name}
                </div>
            </div>
        </div>
    )
}

export default ItemOnCloseRender