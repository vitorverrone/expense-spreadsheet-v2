import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import className from 'classnames';

function UserMenuItem({ user, setShowCardModal, show, setShowMenu }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        Cookies.remove('userid');
        location.reload();
    }

    const classes = className(
        'z-10 font-normal md:bg-white md:divide-y divide-gray-100 rounded-lg md:shadow-sm md:w-44 md:dark:bg-gray-700 md:dark:divide-gray-600 md:absolute right-0 top-[100%] w-full',
        {
            'block': dropdownOpen,
            'hidden': !dropdownOpen,
        }
    );

    useEffect(() => {
        setDropdownOpen(show);
    }, [show])

    return (
        <>
            <li id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbar" className="w-full py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent relative" onMouseOver={() => setDropdownOpen(true)} onMouseOut={() => setDropdownOpen(false)}>
                {user.name}
                <hr className='md:hidden mt-4' />
                <div id="dropdownNavbar" className={classes}>
                    <div className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownLargeButton">
                        <p>
                            <button className="w-full text-left block md:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => { setShowCardModal(true); setDropdownOpen(false); setShowMenu(false)}}>Cartões</button>
                        </p>
                    </div>
                    <div className="py-1">
                        <button onClick={handleLogout} className="w-full text-left block md:px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sair</button>
                    </div>
                </div>
            </li>
        </>
    );
}

export default UserMenuItem;