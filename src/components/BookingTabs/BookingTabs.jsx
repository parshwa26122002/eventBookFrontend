import { useState } from 'react'

function BookingTabs(props) {
    const [isClicked, setIsClicked] = useState(true);

    const bookingClicked = () => {
        setIsClicked(true);
        props.onBookClick();
    }

    const chartClicked = () => {
        setIsClicked(false);
        props.onChartClick();
    }

    return (
        <div className="pt-10 mt-8 flex w-1/6 justify-around">
            <button onClick={bookingClicked} className={`font-comme font-black p-3 border-b-2 ${isClicked ? 'border-indigo-600' : 'border-transparent'}`}>Bookings</button>
            <button onClick={chartClicked} className={`font-comme font-black p-3 border-b-2 ${!isClicked ? 'border-indigo-600' : 'border-transparent'}`}>Chart</button>
        </div>
    );
}

export default BookingTabs