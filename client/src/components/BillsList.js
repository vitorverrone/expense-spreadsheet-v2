import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { MdArrowForwardIos, MdArrowBackIos, MdOutlineRemoveRedEye } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { GoSearch } from "react-icons/go";
import { IoMdTrash } from "react-icons/io";
import { GoPlus } from "react-icons/go";

import { fetchBills } from "../store/apis/billsApi";
import { DeleteBillModal } from "./DeleteBillModal";
import { AddBillFormModal } from "./AddBillFormModal";
import Skeleton from "./Skeleton";

/*
    TODO:
    - Classificação (reordenar)
*/

export function BillsList ({ userId }) {
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [filterSearch, setFilterSearch] = useState('');
    const [month, setMonth] = useState(today.toLocaleString('default', { month: 'long' }));
    const [showDeleteBillModal, setShowDeleteBillModal] = useState(false);
    const [deleteBillId, setDeleteBillId] = useState(0);
    const [showAddBillModal, setShowAddBillModal] = useState(false);
    const [showFilterBar, setShowFilterBar] = useState(false);

    let content;
    let monthTotal = 0;

    let { isFetching, error, data } = useQuery({
        queryKey: ['fetchBills', selectedMonth, filterSearch],
        queryFn: () => fetchBills(userId, selectedMonth, filterSearch),
    });

    const handleChangeMonth = (newMonth) => {
        setSelectedMonth(newMonth);

        const getDateMonth = new Date(today.getFullYear(), newMonth, 1);
        setMonth(getDateMonth.toLocaleString('default', { month: 'long' }))
    }

    const handleDeleteBill = (id) => {
        setDeleteBillId(id);
        setShowDeleteBillModal(true);
    }

    const handleChangeFilterSearch = (e) => {
        setFilterSearch(e.target.value);
    }

    if (isFetching) {
        content =
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <Skeleton className="w-full h-8" />
            </th>
            <td className="px-6 py-4">
                <Skeleton className="w-full h-8" />
            </td>
            <td className="px-6 py-4">
                <Skeleton className="w-full h-8" />
            </td>
            <td className="px-6 py-4">
                <Skeleton className="w-full h-8" />
            </td>
            <td className="px-6 py-4">
                <Skeleton className="w-full h-8" />
            </td>
            <td className="px-6 py-4">
                <Skeleton className="w-full h-8" />
            </td>
        </tr>
    } else if (error) {
        content = <div>Error</div>
    } else {
        content = data.map((bill) => {
            const recurrentBill = bill.recurrent || bill.billType === 'recurrent';
            const isBillActive = recurrentBill || today < new Date(bill.finalDate);

            if (isBillActive) {
                const installmentValue = recurrentBill ? bill.value : (bill.value / bill.installments);
                monthTotal += installmentValue;

                return (
                    <>
                        <tr key={bill.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {bill.title}
                            </th>
                            <td className="px-6 py-4 text-center">
                                {recurrentBill ? '-' : bill.installments}
                            </td>
                            <td className="px-6 py-4 text-center">
                                {installmentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                            <td className="px-6 py-4 text-center">
                                {recurrentBill ? 'Sim' : 'Não'}
                            </td>
                            <td className="px-6 py-4 text-center">
                                {recurrentBill ? '-' : (new Date(bill.finalDate).toLocaleString('default', { month: 'long' })) + ' / ' + new Date(bill.finalDate).getFullYear()}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <button className="cursor-pointer" onClick={() => handleDeleteBill(bill._id)}><IoMdTrash /></button>
                            </td>
                        </tr>
                    </>
                )
            }
        });
    }

    return (
        <>
            <AddBillFormModal show={showAddBillModal} setShow={setShowAddBillModal} userId={userId} />
            <DeleteBillModal show={showDeleteBillModal} setShow={setShowDeleteBillModal} billId={deleteBillId} />

            <div className="flex items-center justify-between mb-4">
                <p className="text-3xl font-bold dark:text-white">Suas contas do mês de {month} / {today.getFullYear()}</p>


                <div className="flex items-center gap-3">
                    <FaFilter className="cursor-pointer" onClick={() => setShowFilterBar(!showFilterBar)} />
                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => handleChangeMonth(selectedMonth - 1)}>
                        <MdArrowBackIos />
                    </button>

                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => handleChangeMonth(selectedMonth + 1)}>
                        <MdArrowForwardIos />
                    </button>
                </div>
            </div>

            {showFilterBar && <div className="my-5 items-center flex gap-5 overflow-hidden">
                <div className="relative w-[50%]">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <GoSearch />
                    </div>
                    <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white w-full outline-none" placeholder="Conta de Luz..." onChange={handleChangeFilterSearch} />
                </div>

                <MdOutlineRemoveRedEye className="cursor-pointer" />
            </div>}

            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nome da conta
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Quantidade de parcelas
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Valor por mês
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Recorrente
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Finaliza em
                            </th>
                            <th scope="col" className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {content}
                    </tbody>
                </table>
            </div>

            <div className="fixed left-0 z-10 bottom-0 w-full container mx-auto flex items-center justify-between dark:bg-gray-900 p-5 shadow-xl">
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => setShowAddBillModal(true)}>
                    <GoPlus />
                </button>

                <h3 className="text-3xl font-bold dark:text-white text-right">Total do mês: {monthTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
            </div>
        </>
    )
}