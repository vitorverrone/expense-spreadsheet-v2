import Cookies from 'js-cookie';
import { Toaster } from 'react-hot-toast';

import { BillsList } from "./components/BillsList";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Login from "./components/Login";

const queryClient = new QueryClient()

function App() {
    const [isLogged, setIsLogged] = useState(false);
    const [userId, setUserId] = useState({});

    const handleLogged = (userId) => {
        setIsLogged(true);
        setUserId(userId);

        Cookies.set('userid', userId, { expires: 7 });
    }

    console.log(import.meta.env)

    useEffect(() => {
        if (Cookies.get('userid')) {
            handleLogged(Cookies.get('userid'))
        }
    }, [])

    return (
        <QueryClientProvider client={queryClient}>
            <Toaster position="top-left" reverseOrder={false} />

            {!isLogged && <Login setIsLogged={handleLogged} />}
            {isLogged && <><Header userId={userId} />
            <div className="container mx-auto pb-[80px]">
                <BillsList userId={userId} />
            </div></>}
        </QueryClientProvider>
    )
}

export default App;