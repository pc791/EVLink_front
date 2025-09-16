import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { Common } from "./Common";

function Main(props: any) {
    const navigate = useNavigate();
    const { t } = useTranslation(); 
    const common = Common();
    const [formData, setFormData] = useState({});

    const pStyle = {
        backgroundColor: 'rgb(255, 255, 255)',
        width: '500px',
        textDecoration: 'none',
        color: '#333333',
        padding: '30px',
        border: '1px solid #e1e1e1',
        boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.15)',
        borderRadius: '10px',
      };

    const buttonStyle = {
        textDecoration : 'none',
        color: '#333333',
        padding: "0px 0px 0px",
        border: '1px solid #e1e1e1',
        boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.15)',
        borderRadius: '10px',
    }

    useEffect(() => {
    });

    const movePage = (url: string) => {
        navigate(url);
    };

    const logout = async () =>  {
        const method = "post";
        const url = "http://localhost/evlink/api/PLogin/logout";
        const data = "";
        const config = "";
        const response = await common.apiRequest(method, url, data, config);
        window.localStorage.removeItem("loginCheck");
        movePage("/Login");
      };
    
      const withdraw = async () => {
        
        if(window.confirm("사용자 정보가 모두 삭제됩니다.\n탈퇴하시겠습니까?")) {
            const method = "post";
            const url = "http://localhost/evlink/api/PLogin/withdraw";
            const data = "";
            const config = "";
            const response = await common.apiRequest(method, url, data, config);
            console.log(response);
            if(response.result === "OK"){
                alert("Membership withdrawal has been completed.");
                movePage("/Login");
            }
        }
      };

    return (
        <div className="main_container">
      <div className="modal">
        <div className="sample_site" style={{ margin: '0 0 0' }}>
          <div style={{ width: '100%', textAlign: 'right', margin: '20px 45px' }}>
          </div>
          <div style={{ width: '100%' }}>
            <ul>
              <li>
                <p style={pStyle}>
                  <strong>PasswordlessX1280로 빠른 인증을 경험해보세요</strong>
                  <span>일회용 패스워드를 사용자가 입력하지 않고 온라인 서비스가 사용자에게 제시 후 이를 사용자가 PasswordlessX1280앱으로 검증하는 기술입니다.</span>
                  <button onClick={logout} style={buttonStyle}>
                    <em className="btn" id="btn_logout">로그아웃</em>
                  </button>
                  &nbsp;&nbsp;
                  <button onClick={withdraw} style={buttonStyle}>
                    <em className="btn" id="btn_delete">탈퇴</em>
                  </button>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    );
}

export default Main;
