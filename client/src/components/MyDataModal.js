import { useForm } from "react-hook-form";
import { useMutation, useQueryClient} from "@tanstack/react-query";
import { GoX } from "react-icons/go";
import { currency } from 'remask';
import className from 'classnames';

import { updateUser } from "../store/apis/usersApi";
import InputForm from "./InputForm";
import { Modal } from "./Modal";

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

    const userData = queryClient.getQueryData(['getUser']);

    const modalFooterContent = (
        <button type="submit" onClick={handleSubmit(handleOnSubmit)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Salvar</button>
    )

    return (
        <Modal show={show} modalTitle="Meus dados" setShow={setShow} modalFooter={modalFooterContent} formSubmit={handleSubmit(handleOnSubmit)}>
            <input type="hidden" {...register('_id')} value={userData.user._id} />
            <div className="mb-5 text-left">
                <label htmlFor="userNickname" className="block mb-2 text-sm font-medium dark:text-white">Usuário</label>
                <InputForm type="text" id="userNickname" {...register('username', { required: "O campo usuário é obrigatório" })} defaultValue={userData.user.username} />
                {errors.username && <span>{errors.username.message}</span>}
            </div>

            <div className="mb-5 text-left">
                <label htmlFor="userEmail" className="block mb-2 text-sm font-medium dark:text-white">E-mail</label>
                <InputForm type="email" id="userEmail" {...register('email', { required: "O campo email é obrigatório" })} defaultValue={userData.user.email} />
                {errors.email && <span>{errors.email.message}</span>}
            </div>

            <div className="mb-5 text-left">
                <label htmlFor="userSalary" className="block mb-2 text-sm font-medium dark:text-white">Salario</label>
                <InputForm type="text" id="userSalary" {...register('salary')} defaultValue={currency.mask({ locale: 'pt-BR', currency: 'BRL', value: userData.user.salary })} onChange={handleCurrencyChange} />
            </div>

            <div className="mb-5 text-left flex items-center">
                <input type="checkbox" id="userSalarySubtraction" {...register('salarySubtraction')} defaultChecked={userData.user.salarySubtraction} />
                <label htmlFor="userSalarySubtraction" className="ml-3 block text-sm font-medium dark:text-white">Subtrair salário do total por mês?</label>
            </div>
        </Modal>
    )
}

export default MyDataModal;