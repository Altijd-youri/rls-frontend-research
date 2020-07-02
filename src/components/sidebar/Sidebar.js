import React from 'react'
import './Sidebar.scoped.css';
import logo from './logo-1.png'
import { NavLink } from 'react-router-dom';
import { PATH } from '../../utils/constants'
import { useAuth0 } from '../../react-auth0-spa';
import { hasPermissions } from '../../utils/scopeChecker';

export default function Sidebar() {
    const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

    const logoutHandler = () => {
        localStorage.removeItem("scopes");
        logout();
    }


    return (
        <div className="sidebar">
            <div className="logo">
                <NavLink to={PATH.HOME}>
                    <img src={logo}
                        alt="logo" />
                </NavLink>
            </div>

            <nav className="menu">
                <ul>
                    {
                        isAuthenticated
                            ?
                            <>
                                {hasPermissions(["read:train"]) && <li>
                                    <NavLink activeClassName="active" to={PATH.TRAINS}>Manage trains</NavLink>
                                </li>}
                                {hasPermissions(["read:traction"]) && <li>
                                    <NavLink activeClassName="active" to={PATH.TRACTIONS}>Manage tractions</NavLink>
                                </li>}
                                {hasPermissions(["read:wagon"]) && <li>
                                    <NavLink activeClassName="active" to={PATH.WAGONS}>Manage wagons</NavLink>
                                </li>}
                                {hasPermissions(["read:user"]) && <li>
                                    <NavLink activeClassName="active" to={PATH.COMPANIES}>Manage companies</NavLink>
                                </li>}
                                <li onClick={() => logoutHandler()}>
                                    <span>Logout</span>
                                </li>
                            </>
                            :
                            <>
                                <li onClick={() => loginWithRedirect({})}>
                                    <span>Login</span>
                                </li>
                            </>
                    }

                </ul>
            </nav>

            {isAuthenticated && <div className="storage">
                <div className="title">
                    <i className="fas fa-user"></i>
                    {user.email}
                </div>
            </div>}

        </div>
    )
}
