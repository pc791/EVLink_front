import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { Common } from "./Common"

function Info(props: any) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const common = Common();

    const movePage = (url: string) => {
        navigate(url);
    };

    useEffect(() => {
        const selPasswordNo = window.localStorage.getItem("selPasswordNo");
        if(selPasswordNo === null){
            window.localStorage.setItem("selPasswordNo", "1");
        }
    });

    return (
        <div className=" main_container">
            <div className="modal">
                <div className="sample_site">
                <div style={{width: '100%', textAlign: 'right', margin: '20px 45px'}}>
                </div>
                <div style={{width: '100%'}}>
                    <ul>
                    <li>
                        <Link to="/passwordLess/login" style={{backgroundColor: '#ffffff', textDecoration: 'none', color: 'inherit'}}>
                            <img src="/images/passwordLess/pl_logo.png" alt="" />
                            <strong>PasswordlessX1280로 빠른 인증을 경험해보세요</strong>
                            <span>일회용 패스워드를 사용자가 입력하지 않고 온라인 서비스가 사용자에게 제시 후 이를 사용자가 PasswordlessX1280앱으로 검증하는 기술입니다.</span>
                            <em className="btn">경험해보기</em>
                        </Link>
                    </li>
                    </ul>
                </div>
                </div>
            </div>
        </div>

    );
}

export default Info;
