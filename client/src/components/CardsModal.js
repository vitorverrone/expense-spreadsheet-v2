import { useState } from "react";
import { GoX } from "react-icons/go";
import { IoMdTrash } from "react-icons/io";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { addCard, fetchCards } from "../store/apis/cardsApi";
import Skeleton from "./Skeleton";
import className from 'classnames';

function CardsModal ({ userId, show, setShow }) {
    const [cardNickname, setCardNickname] = useState('');
    const [cardDayClosing, setCardDayClosing] = useState('');
    const [showForm, setShowForm] = useState(false);

    const queryClient = useQueryClient();

    const { mutate, isLoading } = useMutation({
        mutationFn: addCard,
        onSuccess: () => {
            setShowForm(false),
            queryClient.invalidateQueries({ queryKey: ['fetchcards'] })
        }
    });

    let { isFetching, isPending, error, data } = useQuery({
        queryKey: ['fetchcards'],
        queryFn: () => fetchCards(userId),
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const card = {
            userId: userId,
            nickname: cardNickname,
            closingDay: cardDayClosing,
        }

        mutate(card);
    };

    const handleDeleteCard = () => {

    };

    const classes = className(
        'overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full',
        {
            'flex': show,
            'hidden': !show,
        }
    );

    let content;

    if (isFetching || isPending) {
        content = <ul>
            <li><Skeleton className="w-[100px] h-[20px]" /></li>
            <li><Skeleton className="w-[100px] h-[20px]" /></li>
            <li><Skeleton className="w-[100px] h-[20px]" /></li>
        </ul>
    } else if (error) {
        content = <li>Erro ao buscar cartões... {error}</li>
    } else {
        content = <ul>
            {data.length > 0 && data.map((card) => {
                return (
                    <li key={card._id} className="flex items-center justify-between">
                        <span>{card.nickname}</span>
                        <span>{card.closingDay}</span>
                        <button className="cursor-pointer" onClick={() => handleDeleteCard(card._id)}><IoMdTrash /></button>
                    </li>
                )
            })}

            {!data.length && <li>Nenhum cartão cadastrado</li>}
        </ul>
    }

    return (
        <div id="default-modal" tabIndex="-1" aria-hidden="true" className={classes}>
            <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {showForm ? 'Adicionar Cartão' : 'Cartões'}
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal" onClick={() => setShow(false)}>
                            <GoX />
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <div className="p-4 md:p-5 space-y-4 text-center">
                        {
                            !showForm && <>
                                {content}
                                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 margin-auto" onClick={() => setShowForm(true)}>Adicionar cartão</button>
                            </>
                        }

                        {showForm && <form onSubmit={handleSubmit}>
                            <div className="mb-5 text-left">
                                <label htmlFor="cardNickname" className="block mb-2 text-sm font-medium dark:text-white">Apelido</label>
                                <input type="text" id="cardNickname" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ex: Conta de Luz" required value={cardNickname} onChange={e => setCardNickname(e.target.value)} />
                            </div>

                            <div className="mb-5 text-left">
                                <label htmlFor="cardDayClosing" className="block mb-2 text-sm font-medium dark:text-white">Dia de fechamento</label>
                                <input type="number" id="cardDayClosing" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="15" required value={cardDayClosing} onChange={e => setCardDayClosing(e.target.value)} />
                            </div>

                            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Adicionar</button>
                        </form>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardsModal;