import React from 'react'
import './Sidebar.scoped.css';
import logo from './logo-1.png'
import { NavLink } from 'react-router-dom';
import { PATH } from '../../utils/constants'

export default function Sidebar() {

    return (
        <div className="sidebar">
            <div className="logo">
                <NavLink to={PATH.TRAINS}>
                    <img src={logo}
                        alt="logo" />
                </NavLink>
            </div>

            <nav className="menu">
                <ul>
                    <li>
                        <NavLink activeClassName="active" to={PATH.TRAINS}>Manage trains</NavLink>
                    </li>
                    <li>
                        <NavLink activeClassName="active" to={PATH.TRACTIONS}>Manage tractions</NavLink>
                    </li>
                    <li>
                        <NavLink activeClassName="active" to={PATH.WAGONS}>Manage wagons</NavLink>
                    </li>
                </ul>
            </nav>

            <div className="storage">
                <div className="title">
                    <i className="fas fa-cloud"></i>
                Storage
                <div className="percent">
                        60%
                </div>
                </div>
                <div className="bar">
                    <span style={{ width: '60%' }}></span>
                </div>
            </div>

        </div>
    )
}
