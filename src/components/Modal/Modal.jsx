function Modal({title, children}) {
    return (
        <div className="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-white border shadow-md shadow-indigo-300 border-indigo-300 rounded-2xl w-[80%] sm:w-[70%] md:w-[65%] lg:w-1/2 flex flex-col">
            <header className="bg-indigo-600 text-white rounded-t-2xl p-3 text-base sm:text-lg md:text-xl">{title}</header>
            <section className="sm:py-3 text-sm sm:text-base md:text-lg">{children}</section>
        </div>
    );
}

export default Modal