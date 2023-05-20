import Modal from "../components/Modal/Modal"
import Backdrop from "../components/Modal/Backdrop"
import EventItem from "../components/EventItem";
import { useState, useContext, useEffect } from 'react'
import AuthContext from "../context/auth-context";
import { useNavigate } from "react-router-dom";

function EventsPage() {
    const [createEventClicked, setCreateEventClicked] = useState(false);
    const [viewDetailsClicked, setViewDetailsClicked] = useState(null);
    const [allEvents, setAllEvents] = useState(null);
    const contextVal = useContext(AuthContext);
    const navigate = useNavigate();

    const onViewDetailsClick = (details) => {
        const eventdetails = details;
        setViewDetailsClicked(eventdetails);
    }

    useEffect(() => {
        const requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        description
                        price
                        date
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        };
        fetch('http://localhost:3000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        }).then(resData => {
            const fetchedEvents = resData.data.events.map(event => {
                return (
                    <EventItem onDetailsClick={onViewDetailsClick.bind(this, {id: event._id, title: event.title, description: event.description, price: event.price, date: event.date, creator: event.creator.email})} key={event._id} id={event._id} title={event.title} price={event.price} creatorId={event.creator._id}/>
                );
            });
            setAllEvents(fetchedEvents);
        }).catch(err => {
            console.log(err);
        });
    }, []);

    const cancelClicked = () => {
        setCreateEventClicked(false);
    }

    const confirmClicked = (event) => {
        event.preventDefault();
        setCreateEventClicked(false);
        const title = event.target[0].value;
        const price = +event.target[1].value;
        const date = event.target[2].value;
        const description = event.target[3].value;
        
        if(title.trim().length === 0 || price < 0 || date.trim().length === 0 || description.trim().length === 0) {
            return;
        }

        const requestBody = {
            query: `
                mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
                    createEvent(eventInput: {title: $title, description: $desc, price: $price, date: $date}) {
                        _id
                        title
                        description
                        price
                        date
                    }
                }
            `,
            variables: {
                title: title.trim(),
                desc: description.trim(),
                price: price,
                date: date.trim()
            }
        };
        
        fetch('http://localhost:3000/graphql', {
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
            const gotEvent = (
                <EventItem onDetailsClick={() => {}} key={resData.data.createEvent._id} id={resData.data.createEvent._id} title={resData.data.createEvent.title} price={resData.data.createEvent.price} creatorId={contextVal.userId} />
            );
            const newAllEvents = [...allEvents, gotEvent];
            setAllEvents(newAllEvents);
        }).catch(err => {
            console.log(err);
        });
    }

    const bookClicked = (eventId) => {
        const requestBody = {
            query: `
                mutation BookEvent($evId: ID!) {
                    bookEvent(eventId: $evId) {
                        _id
                    }
                }
            `,
            variables: {
                evId: eventId
            }
        };
        fetch('http://localhost:3000/graphql', {
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
            navigate('/bookings');
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <div className="mt-20 mb-10">
            {(createEventClicked || viewDetailsClicked) && <Backdrop />}
            {createEventClicked && <Modal title={"Add Event"}>
                <form className="flex flex-col items-center justify-center py-2 px-3 sm:px-10 text-xs sm:text-sm" onSubmit={confirmClicked}>
                    <div className="flex flex-col w-full">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" className="border border-black rounded-full py-1 px-3 mt-2 mb-4 focus:outline-indigo-600 font-sans" />
                    </div>
                    <div className="flex flex-col w-full">
                        <label htmlFor="price">Price</label>
                        <input type="number" step="0.01" id="price" className="border border-black rounded-full py-1 px-3 mt-2 mb-4 focus:outline-indigo-600 font-sans" />
                    </div>
                    <div className="flex flex-col w-full">
                        <label htmlFor="date">Date</label>
                        <input type="datetime-local" id="date" className="border border-black rounded-full py-1 px-3 mt-2 mb-4 focus:outline-indigo-600 font-sans" />
                    </div>
                    <div className="flex flex-col w-full">
                        <label htmlFor="description">Description</label>
                        <textarea id="description" rows="4" className="border border-black rounded-xl py-1 px-3 mt-2 mb-4 focus:outline-indigo-600 font-sans" />
                    </div>
                    <div className="flex justify-end py-3 w-full">
                        <button type="button" onClick={cancelClicked} className="colouredButton mr-5">Cancel</button>
                        <button type="submit" className="plainButton">Confirm</button>
                    </div>
                </form>
            </Modal>}
            {viewDetailsClicked && <Modal title={"Event Details"}>
                <div className="flex flex-col p-3">
                    <div><span className="font-comme text-gray-500 font-black">Title: </span>{viewDetailsClicked.title}</div>
                    <div><span className="font-comme text-gray-500 font-black">Description: </span><span className="font-sans font-medium">{viewDetailsClicked.description}</span></div>
                    <div><span className="font-comme text-gray-500 font-black">Price: </span>₹ {viewDetailsClicked.price}</div>
                    <div><span className="font-comme text-gray-500 font-black">Date: </span>{new Date(viewDetailsClicked.date).toLocaleString('en-IN', {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'})}</div>
                    <div><span className="font-comme text-gray-500 font-black">Creator: </span>{viewDetailsClicked.creator}</div>
                    <div className="flex justify-end py-3 mt-6 w-full">
                        <button type="button" onClick={() => setViewDetailsClicked(null)} className="colouredButton mr-5">Cancel</button>
                        {contextVal.token && <button onClick={bookClicked.bind(this, viewDetailsClicked.id)} type="button" className="plainButton">Book</button>}
                    </div>
                </div>
            </Modal>}
            <div className="flex flex-col items-center">
                <div className="flex flex-col justify-center items-center h-32 lg:border lg:mt-5 lg:mb-10 w-full lg:w-1/2 rounded-2xl lg:shadow-md lg:shadow-indigo-300 lg:border-indigo-300 px-3">
                    <p className="mb-3 text-lg sm:text-xl xl:text-2xl">Share your own Events !!</p>
                    {contextVal.token ? (<button className="colouredButton text-sm sm:text-base" onClick={() => {setCreateEventClicked(true)}}>Create Event</button>) : (<p className="mb-3 text-sm text-center sm:text-base xl:text-lg text-gray-500 font-comme font-black">Seems like you've not logged in ˘︹˘ Login to create an event!</p>)}
                </div>
                <div className="flex flex-col items-center w-[90%] sm:w-5/6 md:w-3/4 lg:w-2/3 xl:w-1/2">
                    <h1 className="text-indigo-600 text-xl sm:text-2xl lg:text-3xl mb-4">Events</h1>
                    {allEvents && allEvents.length === 0 && <p className="text-sm text-gray-500 font-black font-comme">Oops! No Events found...</p>}
                    <ul className="w-full">
                        {allEvents ? allEvents : (<div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>)}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default EventsPage