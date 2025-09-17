/** @format */

import "../../css/style.css";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Common } from "../Common";
import qs from 'qs';
import { BASE_URL } from "../../../../../auth/constants";

function Changepw(props: any) {
    const common = Common();
    const { t } = useTranslation(); 
    const navigate = useNavigate();
    const userID = sessionStorage.getItem("userID");
    const [formData, setFormData] = useState<{[key: string]: string}>({});
    const movePage = (url: string) => {
        navigate(url);
    };


    const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
   
    const changePw = async () => {
         
    var id = formData.id === undefined ? "" : formData.id;
    var pw = formData.pw === undefined ? "" : formData.pw;
    var pw2 = formData.pw2 === undefined ? "" : formData.pw2;
  //	email = trim(email);
  
  
    if(id === "") {
      alert("아이디를 입력하세요.");	
      return false;
    }
  
    if(pw === "") {
        alert("비밀번호를 입력하세요.");	
      return false;
    }
  
    if(pw2 === "") {
        alert("비밀번호 확인을 입력하세요.");	
      return false;
    }
    
    if(pw !== pw2) {
        alert("비밀번호가 일치하지 않습니다.");	
        const newFormData = { ...formData };  
        delete newFormData["pw_re"];  
        setFormData(newFormData);
      return false;
    }
    const method = "post";
    const url = `${BASE_URL}/api/PLogin/changepw`;
    var reqeustData = {
      id: formData.id,
      pw: formData.pw
    }
    var data = qs.stringify(reqeustData);
    const config = "";
    const response = await common.apiRequest(method, url, data, config);
    if(response.result === "OK"){
        alert("Password changing complete.");
        movePage("/passwordLess/login");
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
                <em style={{ width: '100%', textAlign: 'center' }}>비밀번호찾기</em> 
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
                        id="pw2"
                        name="pw2"
                        placeholder="Confirmation PASSWORD"
                        value={formData.pw2 || ""}
                        onChange={changeInput}
                      />
                    </div>
                  </form>
                </div>
                <div className="btn_zone">
                  <button onClick={changePw} className="btn active_btn">
                    비밀번호변경
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

export default Changepw;
