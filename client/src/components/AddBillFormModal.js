import { useEffect, useState } from "react";
import { GoX } from "react-icons/go";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addBill } from "../store/apis/billsApi";
import className from 'classnames';
import toast from "react-hot-toast";

export function AddBillFormModal ({ show, setShow, userId }) {
    const [billName, setBillName] = useState('');
    const [billDate, setBillDate] = useState('');
    const [billInstallments, setBillInstallments] = useState(0);
    const [billValue, setbillValue] = useState(0);
    const [billPlaceholderValue, setBillPlaceholderValue] = useState(0);
    const [billType, setBillType] = useState('');
    const [billCardId, setBillCardId] = useState('');
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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (billCardId === '') {
            toast.error('Selecione qual cartão foi utilizado');
            return;
        }

        const today = new Date();
        const date = new Date(billDate);
        const finalDate = new Date(billType === 'installment' ? Date(date).setMonth(date.getMonth() + Number(billInstallments)) : today).toISOString().split('T')[0];

        const bill = {
            title: billName,
            value: billValue,
            installments: billInstallments,
            billType: billType,
            buyDate: billDate,
            finalDate,
            userId: userId,
            cardId: billCardId
        }

        mutate(bill);
    };

    const classes = className(
        'overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full',
        {
            'flex': show,
            'hidden': !show,
        }
    );

    const handleValueChange = (value) => {
        const formattedValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        setBillPlaceholderValue(formattedValue);
        setbillValue(value);
    };

    const handleTypeChange = (e) => {
        setBillType(e.target.value);
    };

    const handleCardChange = (e) => {
        setBillCardId(e.target.value);
    }

    return (
        <div id="default-modal" tabIndex="-1" aria-hidden="true" className={classes}>
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Adicionar Conta
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal" onClick={() => setShow(false)}>
                            <GoX />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <div className="p-4 md:p-5 space-y-4">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <label htmlFor="billName" className="block mb-2 text-sm font-medium dark:text-white">Nome da conta</label>
                                <input type="text" id="billName" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ex: Conta de Luz" required value={billName} onChange={e => setBillName(e.target.value)} />
                            </div>

                            <div className="mb-5">
                                <label htmlFor="billValue" className="block mb-2 text-sm font-medium dark:text-white">Valor da conta</label>
                                <input type="text" id="billValue" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="R$ 200,00" required value={billPlaceholderValue} onChange={e => handleValueChange(e.target.value)} />
                            </div>

                            <div className="mb-5">
                                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Cartão utilizado
                                </h4>

                                <div className="flex items-start my-5 gap-6">
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

                                <div className="flex items-start my-5 gap-6">
                                    {billTypes.map(type => (
                                        <div className="flex items-center h-5" key={type.name}>
                                            <input id={`billType${type.name}`} type="radio" value={type.name} name="billType" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600" onChange={handleTypeChange} />
                                            <label htmlFor={`billType${type.name}`} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Compra {type.displayName}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {billType === 'installment' && (<div className="mb-5">
                                <label htmlFor="billDate" className="block mb-2 text-sm font-medium dark:text-white">Data da compra</label>
                                <input type="date" id="billDate" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required value={billDate} onChange={e => setBillDate(e.target.value)} />
                            </div>)}

                            {billType === 'installment' && (<div className="mb-5">
                                <label htmlFor="billInstallments" className="block mb-2 text-sm font-medium dark:text-white">Parcelas</label>
                                <input type="number" id="billInstallments" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="5" required value={billInstallments} onChange={e => setBillInstallments(e.target.value)} />
                            </div>)}

                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Adicionar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}