import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { GoX } from "react-icons/go";
import className from 'classnames';

function MyDataModal ({ userId, show, setShow }) {
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const classes = className(
        'overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full',
        {
            'flex': show,
            'hidden': !show,
        }
    );

    const inputClasses = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';

    const handleOnSubmit = (data) => {
        console.log(data);
    };

    const data = queryClient.getQueryData(['getUser']);

    return (
        <div id="default-modal" tabIndex="-1" aria-hidden="true" className={classes}>
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Meus dados
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal" onClick={() => setShow(false)}>
                            <GoX />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <div className="p-4 md:p-5 space-y-4 text-center">
                        <form onSubmit={handleSubmit(handleOnSubmit)}>
                            <div className="mb-5 text-left">
                                <label htmlFor="userNickname" className="block mb-2 text-sm font-medium dark:text-white">Usuário</label>
                                <input type="text" id="userNickname" className={inputClasses} {...register('nickname', { required: "O campo usuário é obrigatório" })} value={data.user.nickname} />
                                {errors.nickname && <span>{errors.nickname.message}</span>}
                            </div>

                            <div className="mb-5 text-left">
                                <label htmlFor="userEmail" className="block mb-2 text-sm font-medium dark:text-white">E-mail</label>
                                <input type="email" id="userEmail" className={inputClasses} {...register('email', { required: "O campo email é obrigatório" })} value={data.user.email} />
                                {errors.email && <span>{errors.email.message}</span>}
                            </div>

                            <div className="mb-5 text-left">
                                <label htmlFor="userSalary" className="block mb-2 text-sm font-medium dark:text-white">Salario</label>
                                <input type="number" id="userSalary" className={inputClasses} {...register('salary')} value={data.user.salary} />
                            </div>

                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Salvar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyDataModal;