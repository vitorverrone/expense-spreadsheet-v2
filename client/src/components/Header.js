import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "../store/apis/usersApi";
import { useState } from "react";

import { HiMenu } from "react-icons/hi";
import UserMenuItem from "./UserMenuItem";
import Skeleton from "./Skeleton";
import CardsModal from "./CardsModal";

function Header({ userId }) {
    const [showMenu, setShowMenu] = useState(false);
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
        userMenuItem = <UserMenuItem user={data.user} show={showMenu} setShowMenu={setShowMenu} setShowCardModal={setShowCardsModal} />
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

                <button data-collapse-toggle="navbar-multi-level" type="button" className="h-10 inline-flex items-center justify-center md:hidden p-2 rounded-lg text-sm w-10 text-xl" onClick={() => setShowMenu(!showMenu)} aria-controls="navbar-multi-level" aria-expanded="false">
                    <HiMenu />
                </button>

                <div className={`${!showMenu && 'hidden'} absolute md:static w-full md:block md:w-auto max-w-[90vw] left-auto top-[60px] z-2`} id="navbar-multi-level">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        {userMenuItem}
                    </ul>
                </div>
            </div>
        </nav>
    </>;
}

export default Header;