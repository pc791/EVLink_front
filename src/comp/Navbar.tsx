//comp/Navbar.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import style from './Navbar.module.css';
import { NavLink } from 'react-router-dom';
import DropdownNav from './DropdownNav';

const Navbar: React.FC = () => {
  const commonLinkClass = ({ isActive }:{isActive:boolean}) => {
      return  isActive ? `${style.link} ${style.active}` : style.link;
  }
  return (
    // <nav style={{marginTop:'10px'}}>
    //     <Link to="/" style={{marginRight:'10px'}}>Home</Link>
    //     <Link to="/board" style={{marginRight:'10px'}}>게시판</Link>
    //     <Link to="/gallery" style={{marginRight:'10px'}}>갤러리</Link>
    //     <Link to="/chart" style={{marginRight:'10px'}}>차트</Link>
    //     <Link to="/community" style={{marginRight:'10px'}}>커뮤니티</Link>
    //     <Link to="/diary">일기장</Link>
    // </nav>
    <nav className={style.navbar}>
      <NavLink to="/" 
      className={commonLinkClass}>Home</NavLink>
      <NavLink to="/board" 
      className={commonLinkClass}>게시판</NavLink>
      <NavLink to="/gallery" className={commonLinkClass}>갤러리</NavLink>
      <NavLink to="/chart" className={commonLinkClass}>차트</NavLink>      
      {/* <NavLink to="/community" className={commonLinkClass}>커뮤니티</NavLink> */}
      <DropdownNav/>
      <NavLink to="/diary" className={commonLinkClass}>Diary</NavLink>
      <NavLink to="/memo" className={commonLinkClass}>메모</NavLink> 
      <NavLink to="/map" className={commonLinkClass}>지도</NavLink> 
      <NavLink to="/map2" className={commonLinkClass}>공용</NavLink> 
    </nav>
  )
}
export default Navbar