import AuthContext from "../context/auth-context"
import { useContext } from "react"

function EventItem(props) {
    const context = useContext(AuthContext);
    return (
        <li key={props.id} className="flex justify-between items-center border rounded-2xl shadow-md border-indigo-300 w-full p-3 mb-3">
            <div>
                <h2 className="text-sm sm:text-base lg:text-lg">{props.title}</h2>
                <p className="text-xs sm:text-sm lg:text-base text-gray-500 font-black font-comme">₹ {props.price}</p>
            </div>
            <div>
                {props.creatorId !== context.userId ? (
                    <>
                        <button className="plainButton text-sm py-1 px-3 sm:hidden" onClick={props.onDetailsClick}>𝓲</button>
                        <button className="plainButton text-sm hidden sm:block" onClick={props.onDetailsClick}>View Details</button>
                    </>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 font-black font-comme sm:hidden">~ ⭐</p>
                        <p className="text-sm text-gray-500 font-black font-comme hidden sm:block">You are the owner</p>
                    </>
                )}       
            </div>
        </li>
    )
}

export default EventItem