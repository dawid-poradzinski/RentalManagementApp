import { Link } from "react-router-dom"
import type { ItemEntity } from "../../../../generated-ts/models"

type Props = {item: ItemEntity}

function ItemSmallRender(props: Props) {
    return(
        <Link to={"/worker/items/" + props.item.id} className="w-full h-full max-h-71 bg-gray-200/40 rounded-xl backdrop-blur-lg shadow-xl p-4 flex flex-col gap-2 cursor-pointer transition-transform transform hover:-translate-y-1">
            <div>
                <img className="max-h-25 m-auto" src={props.item.image}></img>
            </div>
            <div className="w-full h-fit min-h-8 truncate max-h-10 p-1 text-center bg-gray-200/40 backdrop-blur-lg rounded-xl shadow-md font-semibold">
                {props.item.name}
            </div>
            <div className="w-full h-fit p-1 text-center bg-gray-200/40 backdrop-blur-lg rounded-xl shadow-md font-semibold">
                {props.item.place}
            </div>
            <div className="w-full h-fit p-1 text-center bg-gray-200/40 backdrop-blur-lg rounded-xl shadow-md font-semibold">
                {props.item.size}
            </div>
            <div className="w-full h-fit p-1 text-center bg-gray-200/40 backdrop-blur-lg rounded-xl shadow-md font-semibold">
                {props.item.price?.priceAmount} {props.item.price?.priceCurrency}
            </div>
        </Link>
    )
}

export default ItemSmallRender