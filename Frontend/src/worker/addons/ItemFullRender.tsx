import type { ItemEntity } from "../../../generated-ts/models"

export default function ItemFullRender(item: ItemEntity) {
    return (
        <div>{item.category}</div>
    )
}