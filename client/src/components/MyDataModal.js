import { useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { GoX } from "react-icons/go";
import { currency } from 'remask';
import className from 'classnames';

import { updateUser } from "../store/apis/usersApi";
import InputForm from "./InputForm";

function MyDataModal ({ show, setShow }) {
    const queryClient = useQueryClient();
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

    const { mutate, isLoading } = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            setShow(false);
            queryClient.invalidateQueries({ queryKey: ['getUser'] })
        }
    });

    const modalClasses = className(
        'overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full',
        {
            'flex': show,
            'hidden': !show,
        }
    );

    const handleOnSubmit = (data) => {
        data.salary = currency.unmask({ locale: 'pt-BR', currency: 'BRL', value: data.salary })
        mutate(data);
    };

    const handleCurrencyChange = (e) => {
        const value = e.target.value || 0;
        const raw = currency.unmask({ locale: 'pt-BR', currency: 'BRL', value: value })
        const masked = currency.mask({ locale: 'pt-BR', currency: 'BRL', value: raw })
        setValue('salary', masked);
    };

    const data = queryClient.getQueryData(['getUser']);
    data.user.salary = currency.mask({ locale: 'pt-BR', currency: 'BRL', value: data.user.salary })

    return (
        <div id="default-modal" tabIndex="-1" aria-hidden="true" className={modalClasses}>
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
                            <input type="hidden" {...register('_id')} value={data.user._id} />
                            <div className="mb-5 text-left">
                                <label htmlFor="userNickname" className="block mb-2 text-sm font-medium dark:text-white">Usuário</label>
                                <InputForm type="text" id="userNickname" {...register('nickname', { required: "O campo usuário é obrigatório" })} defaultValue={data.user.nickname} />
                                {errors.nickname && <span>{errors.nickname.message}</span>}
                            </div>

                            <div className="mb-5 text-left">
                                <label htmlFor="userEmail" className="block mb-2 text-sm font-medium dark:text-white">E-mail</label>
                                <InputForm type="email" id="userEmail" {...register('email', { required: "O campo email é obrigatório" })} defaultValue={data.user.email} />
                                {errors.email && <span>{errors.email.message}</span>}
                            </div>

                            <div className="mb-5 text-left">
                                <label htmlFor="userSalary" className="block mb-2 text-sm font-medium dark:text-white">Salario</label>
                                <InputForm type="text" id="userSalary" {...register('salary')} defaultValue={data.user.salary} onChange={handleCurrencyChange} />
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