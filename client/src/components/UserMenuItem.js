import Cookies from 'js-cookie';
import { useState } from "react";
import className from 'classnames';

function UserMenuItem({ user, setShowCardModal }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        Cookies.remove('userid');
        location.reload();
    }

    const classes = className(
        'z-10 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600 absolute right-0 top-[100%]',
        {
            'block': dropdownOpen,
            'hidden': !dropdownOpen,
        }
    );

    return (
        <>
            <li id="dropdownNavbarLink" data-dropdown-toggle="dropdownNavbar" className="flex items-center justify-between w-full py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent relative" onMouseOver={() => setDropdownOpen(true)} onMouseOut={() => setDropdownOpen(false)}>{user.name}
                <div id="dropdownNavbar" className={classes}>
                    <div className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownLargeButton">
                        <p>
                            <button className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => { setShowCardModal(true); setDropdownOpen(false)}}>Cartões</button>
                        </p>
                    </div>
                    <div className="py-1">
                        <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sair</button>
                    </div>
                </div>
            </li>
        </>
    );
}

export default UserMenuItem;