import { IconCaretLeft, IconCaretRight } from "@tabler/icons-react"

type Props = {currentPage: number, setPage: React.Dispatch<React.SetStateAction<number>>, pageSize: number, setPageSize: React.Dispatch<React.SetStateAction<number>>, maxPage: number}

function PaginationFooter(props: Props) {

    function updatePage(num: number) {
        const max = props.maxPage

        if (props.currentPage >= max) {
            props.setPage(max - 1)
        }
        else if(props.currentPage + num >= 0 && props.currentPage + num < max) {
            props.setPage(a => a + num)
        }  
    }

    function updateSize(num: number) {
        if (num >= 0 && num <= 100) {
            props.setPageSize(num)
        }
    }

    return (
        <div className="w-full h-16 bg-gray-700 rounded-sm shadow-xl backdrop-blur-xl px-2 py-2 flex justify-between text-white flex items-center">
            <div className="w-fit h-fit flex">
                <div className="rounded-l-sm p-1 hover:bg-slate-200/50 cursor-pointer" onClick={() => updatePage(-1)}>
                    <IconCaretLeft stroke={2} size={25} />
                </div>
                <div className="rounded-r-sm p-1 hover:bg-slate-200/50 cursor-pointer" onClick={() => updatePage(1)}>
                    <IconCaretRight stroke={2} size={25} />
                </div>
                <div className="ml-2 px-2 rounded-sm p-1 hidden md:block">
                    Current Page: 
                </div>
                <input type="number" value={props.currentPage+1} className="w-6 text-center" onInput={(e) => props.setPage(Number(e.currentTarget.value)-1)}>
                </input>
                <div className="flex items-center mx-2">
                    of {props.maxPage}
                </div>
            </div>
            <div className="w-fit flex">
                <div className="w-fit h-fit p-1 px-2 rounded-l-sm p-1 hidden md:block">
                    Entities per page:
                </div>
                <select onChange={(e) => updateSize(Number(e.target.value))} className="bg-slate-700">
                        <option key='10' value={"10"}>
                            10
                        </option>
                        <option key='25' value={"25"}>
                            25
                        </option>
                        <option key='50' value={"50"}>
                            50
                        </option>
                        <option key='75' value={"75"}>
                            75
                        </option>
                        <option key='100' value={"100"}>
                            100
                        </option>
                </select>
            </div>
        </div>
    )
}

export default PaginationFooter