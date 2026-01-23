import { Link } from "react-router-dom"
import type { ItemForRental, ItemMinimalInfo } from "../../../../generated-ts/models"

type Props = {item: ItemForRental}

function ItemInRentalRender(props: Props) {
    return(
        <Link to={"/worker/items/" + props.item.item.id} className="w-full bg-gray-700 p-4 backdrop-blur-xl shadow-xl rounded-xl flex gap-2 text-white">
            <div className="w-4/10 flex items-center justify-center">
                <img src={props.item.item.image} className=""></img>
            </div>
            <div className="w-full font-bold text-center flex flex-col justify-between">
                <div>
                    {props.item.item.name}
                </div>
                <div>
                    {props.item.price.priceAmount + " " + props.item.price.priceCurrency}
                </div>
            </div>
        </Link>
    )
}

export default ItemInRentalRender