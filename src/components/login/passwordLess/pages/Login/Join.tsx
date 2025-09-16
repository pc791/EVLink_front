import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Common } from "../Common";
import qs from 'qs';

function Join(props: any) {
    const common = Common();
    const { t } = useTranslation(); 
    const navigate = useNavigate();
    const [formData, setFormData] = useState<{[key: string]: string}>({});
    
    useEffect(() => {
    }, []);

    const movePage = (url: string) => {
        navigate(url);
    };


    const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

  const join = async () => {
   
    
    var id = formData.id === undefined ? "" : formData.id;
    var pw = formData.pw === undefined ? "" : formData.pw;
    var pw_re = formData.pw_re === undefined ? "" : formData.pw_re;
  //	email = trim(email);
  
  
    if(id === "") {
      alert("아이디를 입력하세요.");	
      return false;
    }
  
    if(pw === "") {
        alert("비밀번호를 입력하세요.");	
      return false;
    }
  
    if(pw_re === "") {
        alert("비밀번호 확인을 입력하세요.");	
      return false;
    }
    
    if(pw !== pw_re) {
        alert("비밀번호가 일치하지 않습니다.");	
        const newFormData = { ...formData };  
        delete newFormData["pw_re"];  
        setFormData(newFormData);
      return false;
    }
    const method = "post";
    const url = "http://localhost/evlink/api/PLogin/join";
    var reqeustData = {
      id: formData.id,
      pw: formData.pw,
      email: formData.email
    }
    var data = qs.stringify(reqeustData);
    const config = "";
    const response = await common.apiRequest(method, url, data, config);
    if(response.result === "OK"){
        alert("회원가입을 완료하였습니다.\n패스워드리스 등록 후 로그인하시기 바랍니다.");
        movePage("/passwordLess");
    }
    else{
        alert(response.result);
    }
  };

    
    return (
        <div className="main_container">
            <div className="modal">
            <div style={{ width: '100%', textAlign: 'right' }}>
            </div>
            <div className="login_article">
                <div className="title">
                <em style={{ width: '100%', textAlign: 'center' }}>회원가입</em> 
                </div>
                <div className="content">
                <div>
                    <form>
                    <div className="input_group">
                        <input
                        type="text"
                        id="id"
                        name="id"
                        placeholder="ID"
                        value={formData.id || ""}
                        onChange={changeInput}
                        />
                    </div>
                    <div className="input_group">
                        <input
                        type="password"
                        id="pw"
                        name="pw"
                        placeholder="PASSWORD"
                        value={formData.pw || ""}
                        onChange={changeInput}
                        />
                    </div>
                    <div className="input_group">
                        <input
                        type="password"
                        id="pw_re"
                        name="pw_re"
                        placeholder="Confirmation PASSWORD"
                        value={formData.pw_re || ""}
                        onChange={changeInput}
                        />
                    </div>
                    <div className="input_group">
                        <input
                        type="text"
                        id="eamil"
                        name="email"
                        placeholder="E-MAIL"
                        value={formData.email || ""}
                        onChange={changeInput}
                        />
                    </div>
                    </form>
                </div>
                <div className="btn_zone">
                    <button onClick={join} className="btn active_btn">
                        회원가입
                    </button>
                    &nbsp;
                    <Link to="/passwordLess" className="btn active_btn">
                        취소
                    </Link>
                </div>
                </div>
            </div>
            </div>
            <div className="modal_bg"></div>
        </div>
    );
}

export default Join;
