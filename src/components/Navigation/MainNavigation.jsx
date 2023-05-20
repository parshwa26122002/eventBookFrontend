import { NavLink, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react';
import AuthContext from '../../context/auth-context'

function MainNavigation() {
    const contextVal = useContext(AuthContext);
    const [menuClicked, setMenuClicked] = useState(false);
    const navigate = useNavigate();

    const logoutHandler = () => {
        navigate('/auth');
        contextVal.logout();
        setMenuClicked(false);
    }

    return (
        <>
            <header className='flex fixed top-0 left-0 w-full h-14 items-center bg-indigo-600 text-white justify-between'>
                <div className='basis-1/3'>
                    <h1 className='ml-2 xl:ml-10 font-black font-brunoAce text-2xl sm:text-3xl xl:text-4xl'>eventZ</h1>
                </div>
                <nav className='basis-1/4 hidden md:block md:basis-1/3 lg:basis-1/4'>
                    <ul className='flex justify-around text-lg md:text-base xl:text-xl'>
                        {!contextVal.token && <li className='transition hover:text-indigo-200 duration-500'><NavLink to='auth'>Users</NavLink></li>}
                        <li className='transition hover:text-indigo-200 duration-500'><NavLink to='events'>Events</NavLink></li>
                        {contextVal.token && <li className='transition hover:text-indigo-200 duration-500'><NavLink to='bookings'>Bookings</NavLink></li>}
                        {contextVal.token && <li className='transition hover:text-indigo-200 duration-500'><button onClick={logoutHandler}>Logout</button></li>}
                    </ul>
                </nav>
                <button onClick={() => setMenuClicked(!menuClicked)} className='mr-2 h-5 flex flex-col items-end justify-between md:hidden'>
                    <div className={`transform h-1 bg-white rounded-full ${menuClicked ? 'w-4' : 'w-6'} duration-300`}></div>
                    <div className={`transform h-1 bg-white rounded-full ${menuClicked ? 'w-6' : 'w-4'} duration-300`}></div>
                    <div className={`transform h-1 bg-white rounded-full ${menuClicked ? 'w-4' : 'w-6'} duration-300`}></div>
                </button>
            </header>
            {menuClicked && (
                <div className='animate-open-menu fixed left-0 right-0 top-14 bottom-0 w-full h-screen bg-indigo-400 opacity-100 origin-top'>
                    <ul className='flex flex-col items-center justify-around text-lg text-white h-28 pt-3'>
                        {!contextVal.token && <li><NavLink to='auth' onClick={() => setMenuClicked(false)}>Users</NavLink></li>}
                        <li><NavLink to='events' onClick={() => setMenuClicked(false)}>Events</NavLink></li>
                        {contextVal.token && <li><NavLink to='bookings' onClick={() => setMenuClicked(false)}>Bookings</NavLink></li>}
                        {contextVal.token && <li><button onClick={logoutHandler}>Logout</button></li>}
                    </ul>
                </div>
            )}
        </>
    );
}
 
export default MainNavigation;