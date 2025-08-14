import React, { useRef, useState } from 'react'
import style from './Navbar.module.css';
import { NavLink } from 'react-router-dom';

const DropdownNav: React.FC = () => {
    //true, false에 따라서 드랍다운 여부를 결정하기 위한 상태값
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const toggleDropdown = () => { setIsOpen((prev) => !prev) }
    const closeDropdown = () => {setIsOpen(false)}

    //active 스타일을 함수적으로 제어
    const linkClass=({isActive}:{isActive : boolean})=> isActive?`${style.link}${style.active}`:style.link
    return (
        <div ref={dropdownRef} className={style.dropdown}>
            <div onClick={toggleDropdown} className={style.link}>
                커뮤니티 <span className={style.arrow}>{isOpen ? '▲' : '▼'}</span>
            </div>
            {isOpen && (
                <div className={style.dropdownContent}>
                    <NavLink to="" onClick={closeDropdown} className={linkClass}>
                        자유게시판
                    </NavLink>
                    <NavLink to="/community/uplist" onClick={closeDropdown} className={linkClass}>
                        UpBoard
                    </NavLink>
                    <NavLink to="" onClick={closeDropdown} className={linkClass}>
                        설문조사
                    </NavLink>
                </div>
            )}
        </div>
    )
}

export default DropdownNav