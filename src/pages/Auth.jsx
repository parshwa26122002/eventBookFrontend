import { useState, useContext } from 'react'
import AuthContext from '../context/auth-context'
import { useNavigate } from 'react-router-dom';
import login from '../assets/login.jpg'
import signup from '../assets/signup.jpg'

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const contextVal = useContext(AuthContext);

    function submitHandler(event) {
        event.preventDefault();
        const email = event.target[0].value;
        const password = event.target[1].value;
        if(email.trim().length === 0 || password.trim().length === 0) {
            return;
        }
        let requestBody = {
            query: `
                mutation CreateUser($email: String!, $pass: String!) {
                    createUser(userInput: {email: $email, password: $pass}) {
                        _id
                        email
                    }
                }
            `,
            variables: {
                email: email.trim(),
                pass: password.trim()
            }
        };
        if(isLogin) {
            requestBody = {
                query: `
                    query Login($email: String!, $pass: String!) {
                        login(email: $email, password: $pass) {
                            userId
                            token
                            tokenExpiration
                        }
                    }
                `,
                variables: {
                    email: email.trim(),
                    pass: password.trim()
                }
            };
        }
        fetch('https://eventbook-rxhq.onrender.com/graphql', {
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
            if(isLogin) {
                navigate('/events');
                contextVal.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration);
            }
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <div className='flex flex-col md:flex-row-reverse justify-center items-center md:h-screen pb-10 sm:pb-20 md:pb-5 lg:my-5 xl:m-0'>
            {isLogin ? (
                <div className='mt-20 w-[90%] sm:w-[70%] sm:h-96'><img src={login} alt="login" className='sm:w-full sm:h-full sm:object-contain'/></div>
            ) : (
                <div className='mt-20 w-[90%] sm:w-[70%] sm:h-96'><img src={signup} alt="signup" className='sm:w-full sm:h-full sm:object-contain'/></div>
            ) }
            <div className='w-full flex flex-col justify-center items-center md:mt-10'>
                <div className='my-3 sm:my-10 md:my-5'>
                    <h1 className='text-indigo-600 text-xl sm:text-2xl xl:text-3xl'>{isLogin ? 'Login' : 'Sign Up'}</h1>
                </div>
                <form className="flex flex-col items-center justify-center sm:w-[80%] w-[90%] h-full sm:border sm:shadow-md sm:shadow-indigo-300 sm:border-indigo-300 sm:rounded-2xl sm:px-10 sm:py-10 py-8 xl:py-10 xl:px-20" onSubmit={submitHandler}>
                    <div className="flex flex-col w-full">
                        <label htmlFor="email" className="sm:text-lg xl:text-xl">E-mail</label>
                        <input type="email" id="email" className="border border-black rounded-full py-1 px-3 mt-2 mb-4 focus:outline-indigo-600 font-sans" />
                    </div>
                    <div className="flex flex-col w-full">
                        <label htmlFor="password" className="sm:text-lg xl:text-xl">Password</label>
                        <input type="password" id="password" className="border border-black rounded-full py-1 px-3 mt-2 mb-4 focus:outline-indigo-600 font-sans" />
                    </div>
                    <div className="flex flex-col sm:flex-row md:flex-col xl:flex-row w-full mt-4 justify-around sm:text-base text-sm xl:text-lg">
                        <button type="button" className="colouredButton md:py-1 xl:py-2" onClick={() => setIsLogin(!isLogin)}>Switch to {isLogin ? "Sign Up" : "Login"}</button>
                        <button type="submit" className="plainButton mt-3 sm:mt-0 md:py-1 md:mt-3 xl:mt-0 xl:py-2">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AuthPage
