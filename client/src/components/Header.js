import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "../store/apis/usersApi";
import { useState } from "react";
import UserMenuItem from "./UserMenuItem";
import Skeleton from "./Skeleton";
import CardsModal from "./CardsModal";

function Header({ userId }) {
    const queryClient = useQueryClient();
    const [showCardsModal, setShowCardsModal] = useState(false);

    let { isFetching, error, data } = useQuery({
        queryKey: ['getUser'],
        queryFn: () => getUser(userId),
    });

    let cardModal;
    let userMenuItem;

    if (isFetching) {
        userMenuItem = <li><Skeleton className="w-[100px] h-[20px]" /></li>
    } else if (error) {
        userMenuItem = <li><Skeleton className="w-[100px] h-[20px]" /></li>
    } else {
        cardModal = <CardsModal show={showCardsModal} setShow={setShowCardsModal} userId={data.user._id} />
        userMenuItem = <UserMenuItem user={data.user} setShowCardModal={setShowCardsModal} />
    }

    return <>
        {cardModal}
        <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
            <div className="container mx-auto flex flex-wrap items-center justify-between mx-auto mb-[50px]">
                <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                        Gerenciador de contas
                    </span>
                </a>
                <button data-collapse-toggle="navbar-multi-level" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-multi-level" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-multi-level">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        {userMenuItem}
                    </ul>
                </div>
            </div>
        </nav>
    </>;
}

export default Header;