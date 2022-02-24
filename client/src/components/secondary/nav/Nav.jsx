import React, { useEffect, useState } from 'react';
import LOGO from '../../../assets/logo_netflix.png';
import AVATAR from '../../../assets/avatar.png';
import "./nav.css";

function Nav() {
    const [state, setState] = useState(false);

    const transitionNavBar = () => {
        if (window.scrollY > 100) {
            setState(true);
        } else {
            setState(false)
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", transitionNavBar);
        return () => window.removeEventListener("scroll", transitionNavBar)
    }, []);

    return (
        <div className={`nav__container ${state && 'nav__black'}`}>
            <div className="nav__content">
                <img src={LOGO} alt="" className='nav__logo' />
                <img src={AVATAR} alt="" className='avatar__logo' />
            </div>
        </div>
    )
}

export default Nav