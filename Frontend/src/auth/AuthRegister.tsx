import { Link } from "react-router-dom";

function AuthRegister() {
    return(
        <div className="bg-gray-800 min-h-fit w-2/6 h-3/5 mx-auto p-8 shadow-xl backdrop-blur-xl rounded-xl text-white flex items-center">
            <div className="w-full h-fit flex flex-col gap-4">
                <div className="w-full h-20 text-5xl text-center flex justify-center items-center">
                    Register
                </div>
                <form className="flex flex-col gap-4 items-center">
                    <div className="flex flex-col w-1/2">
                        <label htmlFor={"login"}>Login</label>
                        <input type="text" name="login" className="w-full border p-2 rounded-md" required></input>
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label htmlFor={"password"}>Password</label>
                        <input type="password" name="password" className="w-full border p-2 rounded-md" required></input>
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label htmlFor={"phone"}>Phone</label>
                        <input type="tel" name="phone" className="w-full border p-2 rounded-md" required></input>
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label htmlFor={"name"}>Name</label>
                        <input type="text" name="name" className="w-full border p-2 rounded-md" required></input>
                    </div>
                    <div className="flex flex-col w-1/2">
                        <label htmlFor={"surname"}>Surname</label>
                        <input type="text" name="surname" className="w-full border p-2 rounded-md" required></input>
                    </div>
                    <button className="bg-sky-500 px-10 py-2 rounded-xl cursor-pointer">
                        Register
                    </button>
                </form>
                <Link to={"/auth/login"} className="text-sm text-center cursor-pointer">
                    Already have account? login here
                </Link>
            </div>
        </div>
    )
}

export default AuthRegister;