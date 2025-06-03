import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { currency } from 'remask';

import toast from "react-hot-toast";

import { addBill } from "../store/apis/billsApi";
import InputForm from "./InputForm";
import { Modal } from "./Modal";

export function AddBillFormModal ({ show, setShow, userId }) {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const [billCardId, setBillCardId] = useState('');
    const [billType, setBillType] = useState('');
    const [userCards, setUserCards] = useState([]);
    const billTypes = [
        {
            name: 'normal',
            displayName: 'Normal'
        },
        {
            name: 'recurrent',
            displayName: 'Recorrente'
        },
        {
            name: 'installment',
            displayName: 'Parcelada'
        }
    ];

    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation({
        mutationFn: addBill,
        onSuccess: () => {
            setShow(false),
            queryClient.invalidateQueries({ queryKey: ['fetchBills'] })
        }
    });

    useEffect(() => {
        if (show) {
            const cards = queryClient.getQueryData(['fetchcards']);
            setUserCards(cards);
        }
    }, [show]);

    const handleOnSubmit = (data) => {
        if (billCardId === '') {
            toast.error('Selecione qual cartão foi utilizado');
            return;
        }

        const today = new Date();
        const date = new Date(data.billDate);
        const finalDate = new Date(billType === 'installment' ? new Date(date).setMonth(date.getMonth() + Number(data.installments)) : today).toISOString().split('T')[0];

        data.value = currency.unmask({ locale: 'pt-BR', currency: 'BRL', value: data.value })

        const bill = {...data,
            billType: billType,
            buyDate: data.billDate,
            finalDate,
            userId: userId,
            cardId: billCardId
        }

        mutate(bill);
    };

    const handleTypeChange = (e) => {
        setBillType(e.target.value);
    };

    const handleCardChange = (e) => {
        setBillCardId(e.target.value);
    }

    const handleCurrencyChange = (e) => {
        const value = e.target.value || 0;
        const raw = currency.unmask({ locale: 'pt-BR', currency: 'BRL', value: value })
        const masked = currency.mask({ locale: 'pt-BR', currency: 'BRL', value: raw })
        setValue('value', masked);
    };

    const modalFooterContent = (
        <button type="button" onClick={handleSubmit(handleOnSubmit)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Adicionar</button>
    )

    return (
        <Modal show={show} modalTitle="Adicionar Conta" setShow={setShow} formSubmit={handleSubmit(handleOnSubmit)} modalFooter={modalFooterContent}>
            <div className="mb-5">
                <label htmlFor="title" className="block mb-2 text-sm font-medium dark:text-white">Nome da conta</label>
                <InputForm type="text" id="title" placeholder="Ex: Conta de Luz" {...register('title', { required: "O campo nome é obrigatório" })} />
                {errors.title && <span>{errors.title.message}</span>}
            </div>

            <div className="mb-5">
                <label htmlFor="value" className="block mb-2 text-sm font-medium dark:text-white">Valor da conta</label>
                <InputForm type="text" id="value" placeholder="R$ 200,00" {...register('value', { required: "O campo valor é obrigatório" })} onChange={handleCurrencyChange} />
                {errors.value && <span>{errors.value.message}</span>}
            </div>

            <div className="mb-5">
                <label htmlFor="billDate" className="block mb-2 text-sm font-medium dark:text-white">Data da compra</label>
                <InputForm type="date" id="billDate" placeholder="Ex: Conta de Luz" {...register('billDate', { required: "O campo data é obrigatório" })} />
                {errors.billDate && <span>{errors.billDate.message}</span>}
            </div>

            <div className="mb-5">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Cartão utilizado
                </h4>

                <div className="flex items-start my-5 gap-6 flex-wrap">
                    {userCards.length === 0 && 'Nenhum cartão cadastrado'}
                    {userCards.length > 0 && userCards.map(card => (
                        <div className="flex items-center h-5" key={card._id}>
                            <input id={`billCard${card.nickname}`} type="radio" value={card._id} name="billCard" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600" onChange={handleCardChange} />
                            <label htmlFor={`billCard${card.nickname}`} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{card.nickname}</label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="my-5">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Tipo de compra
                </h4>

                <div className="flex items-start my-5 gap-6 flex-wrap">
                    {billTypes.map(type => (
                        <div className="flex items-center h-5" key={type.name}>
                            <input id={`billType${type.name}`} type="radio" value={type.name} name="billType" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600" onChange={handleTypeChange} />
                            <label htmlFor={`billType${type.name}`} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Compra {type.displayName}</label>
                        </div>
                    ))}
                </div>
            </div>

            {billType === 'installment' && (<div className="mb-5">
                <label htmlFor="installments" className="block mb-2 text-sm font-medium dark:text-white">Parcelas</label>
                <InputForm type="number" id="installments" placeholder="Ex: Conta de Luz" {...register('installments', { required: "O campo parcelas é obrigatório" })} />
                {errors.installments && <span>{errors.installments.message}</span>}
            </div>)}
        </Modal>
    )
}