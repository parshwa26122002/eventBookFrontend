import { useEffect, useContext, useState } from "react";
import AuthContext from "../context/auth-context";
import BookingTabs from "../components/BookingTabs/BookingTabs";
import Chart from "../components/Chart/Chart";

function BookingsPage() {
    const [bookins, setBookins] = useState(null);
    const [isBooking, setIsBooking] = useState(true);
    const contextVal = useContext(AuthContext);

    const delBook = (bookingId) => {
        const requestBody = {
            query: `
                mutation CancelBooking($bookId: ID!) {
                    cancelBooking(bookingId: $bookId) {
                        _id
                    }
                }
            `,
            variables: {
                bookId: bookingId
            }
        };
        fetch('https://eventbook-rxhq.onrender.com/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${contextVal.token}`
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        }).then(resData => {
            const remBookings = bookins.filter(booking => booking._id !== bookingId);
            setBookins(remBookings);
        }).catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        const requestBody = {
            query: `
                query {
                    bookings {
                        _id
                        event {
                            title
                            date
                            price
                        }
                    }
                }
            `
        };
        fetch('https://eventbook-rxhq.onrender.com/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${contextVal.token}`
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        }).then(resData => {
            const fetchedBookings = resData.data.bookings;
            setBookins(fetchedBookings);
        }).catch(err => {
            console.log(err);
        });
    }, []);

    const displayItems = () => {
        return bookins.map(booking => (
            <li key={booking._id} className="flex justify-between items-center rounded-2xl shadow-md border border-indigo-300 w-full p-3 mb-3">
                <div>
                    <h2 className="text-sm sm:text-base lg:text-lg">{booking.event.title}</h2>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-500 font-black font-comme">{new Date(booking.event.date).toLocaleString('en-IN', {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'})}</p>
                </div>
                <button onClick={delBook.bind(this, booking._id)} className="colouredButton py-1 px-3">✖</button>
            </li>
        ));
    }

    return (
        <div className="flex flex-col items-center">
            <BookingTabs onBookClick={() => setIsBooking(true)} onChartClick={() => setIsBooking(false)}/>
            {bookins && bookins.length === 0 && <p className="text-sm text-gray-500 font-black font-comme p-5">Oops! You have no Bookings...</p>}
            {isBooking ? (<ul className="w-full sm:w-5/6 md:w-3/4 lg:w-2/3 xl:w-1/2 p-5">{bookins && displayItems()}</ul>) : <Chart bookings={bookins}/>}
            {!bookins && <div className="lds-roller p-5"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>}
        </div>      
    )
}

export default BookingsPage
