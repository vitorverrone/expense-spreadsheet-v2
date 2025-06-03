import toast from "react-hot-toast";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../store/apis/usersApi";

import Loading from "./Loading";


function Login ({ setIsLogged }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const mutation = useMutation({
        mutationKey: ['login'],
        mutationFn: login,
        onSuccess: (data) => {
            if (data.success) {
                setIsLogged(data.user._id);
            } else {
                toast.error(data.msg);
            }
        },
        onError: () => {
            toast.error('Não foi possivel realizar o login neste momento, tente novamente mais tarde');
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = {
            username: username,
            password: password
        }

        mutation.mutate(user);
    };

    return (
        <>
            <div className="flex items-center justify-center h-full">
                <form className="w-[400px] max-w-full" onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Usuário</label>
                        <input type="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</label>
                        <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className="flex justify-between items-center">
                        {/* <button type="button">Criar conta</button> */}
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex justify-center">{mutation.isLoading ? <Loading /> : 'Entrar'}</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login;