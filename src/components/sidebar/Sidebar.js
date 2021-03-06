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
                <NavLink activeClassName="unknown" to={PATH.HOME}>
                    <img src={logo}
                        alt="logo" />
                </NavLink>
            </div>

            <nav className="menu">
                <ul>
                    {
                        /** Boolean isAuthenticated. Only show routing options in sidebar if isAuthenticated is true
                         * if false show Login
                         */
                        isAuthenticated
                        
                            ?
                            <>
                                {hasPermissions(["read:company"]) && <li>
                                    <NavLink activeClassName="active" to={PATH.COMPANIES}>Manage companies</NavLink>
                                </li>}
                                {hasPermissions(["read:company"]) && <li>
                                    <NavLink activeClassName="active" to={PATH.CUSTOMERS}>Manage customers</NavLink>
                                </li>}
                                {hasPermissions(["read:traction"]) && <li>
                                    <NavLink activeClassName="active" to={PATH.TRACTIONS}>Manage tractions</NavLink>
                                </li>}                            
                                {hasPermissions(["read:train"]) && <li>
                                    <NavLink activeClassName="active" to={PATH.TRAINS}>Manage trains</NavLink>
                                </li>}
                                {hasPermissions(["read:superuser"]) && <li>
                                    <NavLink activeClassName="active" to={PATH.USERS}>Manage users</NavLink>
                                </li>}
                                {hasPermissions(["read:wagon"]) && <li>
                                    <NavLink activeClassName="active" to={PATH.WAGONS}>Manage wagons</NavLink>
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
            
            
            {/** If isAthenticated is true show role and email in sidebar */
            isAuthenticated && <div className="storage">
                <div className="title">
                    <div>{user['https://any-namespace/roles']}</div>
                    
                </div>
                <div className="title">
                    <div><i className="fas fa-user"></i></div>
                    <div>{user.email}</div>
                    
                </div>
            </div>}

        </div>
    )
}
