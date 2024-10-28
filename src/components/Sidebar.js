import React, {useEffect, useState} from 'react';
import items from "../data/SidebarData.json"
import { Link, useLocation } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie";

const Sidebar = () => {
    const [selected, setSelected] = useState(null);
    const location = useLocation().pathname;
    const [activeLabelIndex, setActiveLabelIndex] = useState(null);
    const token = Cookies.get("jwtToken");
    const userRole = jwtDecode(token).userrole;
    let role_utilisateur = "";

    if (userRole === "SUPERADMIN") {
        role_utilisateur = jwtDecode(token).superadmintype;
    } else if (userRole === "ADMIN") {
        role_utilisateur = jwtDecode(token).admintype;
    } else {
        role_utilisateur = userRole;
    }

    useEffect(() => {
        items.forEach((parent, i) => {
            if (parent.childrens) {
                parent.childrens.forEach((child) => {
                    if (child.path === location) {
                        setSelected(i);
                        setActiveLabelIndex(child.id);
                    }
                });
            }
        });
    }, [location]);

    const toggle = (k, i) => {
        setSelected(k);
        setActiveLabelIndex(i);
    };

    const hasAccess = (itemRoles) => {
        if (!itemRoles) return true; // If no roles defined, allow access
        return itemRoles.includes(role_utilisateur);
    };

    // Function to render icons dynamically
    const renderIcon = (icon) => {
        // Assuming your icon format is 'data-feather="grid"', extract 'grid'
        const iconName = icon.match(/data-feather="([^"]+)"/)?.[1] || '';
        return <i data-feather={iconName}></i>;
    };

    return (
        <React.Fragment>
            <section>
                <div className="sidebar" id="sidebar">
                    <div className="sidebar-inner slimscroll">
                        <div id="sidebar-menu" className="sidebar-menu">
                            <ul>
                                <li className="submenu-open">
                                    <h6 className="submenu-hdr">Main</h6>
                                    <ul>
                                        {items.map((itemParent, i) => (
                                            hasAccess(itemParent.roles) && (
                                                itemParent.childrens && itemParent.childrens.length > 0 ? (
                                                    // If the item has children, display the submenu layout
                                                    <li key={i} className="submenu">
                                                        <a className={selected === i ? 'subdrop active' : ''}>
                                                            {renderIcon(itemParent.icon)}
                                                            <span>{itemParent.title}</span>
                                                            <span className="menu-arrow"></span>
                                                        </a>
                                                        <ul>
                                                            {itemParent.childrens.map((item, j) => (
                                                                hasAccess(item.roles) && (
                                                                    <li key={j}>
                                                                        <Link
                                                                            to={item.path}
                                                                            className={activeLabelIndex === item.id ? 'active' : ''}
                                                                            onClick={() => toggle(i, item.id)}
                                                                        >
                                                                            {item.title}
                                                                        </Link>
                                                                    </li>
                                                                )
                                                            ))}
                                                        </ul>
                                                    </li>
                                                ) : (
                                                    // If the item does not have children, display a simple item
                                                    <li key={i} className={selected === i ? 'active' : ''}>
                                                        <Link to={itemParent.path || "#"} onClick={() => toggle(i, null)}>
                                                            {renderIcon(itemParent.icon)}
                                                            <span>{itemParent.title}</span>
                                                        </Link>
                                                    </li>
                                                )
                                            )
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};

export default Sidebar;
