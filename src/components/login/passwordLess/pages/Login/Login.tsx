import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Common } from "../Common";
import qs from 'qs';
import { useAuth } from "../../../../../auth/AuthProvider";

function Login(props: any) {
    const { checkLogin } = useAuth();
    useEffect(() => {
		selPassword(parseInt(window.localStorage.getItem("selPasswordNo") || "1"));
    }, []);

    const common = Common();
    const { t} = useTranslation(); 
    const navigate = useNavigate();
	const serverUrlRef = useRef<HTMLSpanElement>(null);
	const registerKeyRef = useRef<HTMLSpanElement>(null);

    const [formData, setFormData] = useState<{[key: string]: string}>({});
    const [selPasswordNo, setSelPasswordNo] = useState(parseInt(window.localStorage.getItem("selPasswordNo") || "1"));  // 1:password, 2:passwordless, 3:passwordless manage
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [checkMillisec, setCheckMillisec] = useState(0);
    let passwordlessTerms = useRef(0);
    let passwordlessMillisec = useRef(0);
    let pushConnectorUrl = "";
    let pushConnectorToken = "";
    let sessionId = "";
    let checkType = useRef<string | null>(null);
	const [PasswordlessToken, setPasswordlessToken] = useState("");
	const [width, setWidth] = useState(0);
	const [tmpPassword, setTempPassword] = useState("--- ---");
	const [showHelp, setShowHelp] = useState("none");
	const [loginTitle, setLoginTitle] = useState("Password 로그인");
	const [loginbutton, setLoginButton] = useState("로그인");
	const [tmp_min, setTmp_min] = useState(0);
	const [tmp_sec, setTmp_sec] = useState(0);
	const [qrSrc, setqrSrc] = useState("");
	const [idCheck, setIdCheck] = useState(false);
	const [loginStatus, setloginStatus] = useState(false);
	const qrSocket = useRef<WebSocket | null>(null);
	const [socketCheck, setsocketCheck] = useState(true);
	let lStatus = false;
	let servicePassword = "";


	const [serverUrl, setServerUrl] = useState("");
	const [registerKey, setRegisterKey] = useState("");
	const [qrCheck, setQrcheck] = useState(false);
	
	let timerCheck = false;
	let timer: NodeJS.Timeout;

	let passwordless_milisec = 0;
	let passwordless_terms = 0;
	let check_millisec = 0;

	const movePage = (url: string) => {
		navigate(url);
	};

	const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const selPassword = (sel: number) => {

	setSelPasswordNo(sel);
	if(sel === 1 || sel === 2 ){
		window.localStorage.setItem("selPasswordNo", sel.toString());
	}
	if(sel === 1){
		setLoginButton("로그인");
		setLoginTitle("Password 로그인");
	}

	if(sel === 2){
		setLoginButton("로그인");
		setLoginTitle("Passwordless 로그인");
	}

	if(sel === 3){
		setLoginButton("Passwordless 등록/해지");
		setLoginTitle("Passwordless 등록/해지");
	}
	};

	const show_help = () => {
	if(showHelp === "none") {
		setShowHelp("block");
	}
	else{
		hide_help();
	}
	};

	const hide_help = () => {
	setShowHelp("none");
	};

	const login = async () => {

	if(selPasswordNo === 1) {
		if(formData.pw === "" || formData.pw === undefined ) {
		alert("비밀번호를 입력하세요.");	
		return false;
		}
		const method = "post";
		const url = "http://localhost/evlink/api/PLogin/loginCheck";
		const data = qs.stringify(formData);
		const config = {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		};
		const response = await common.apiRequest(method, url, data, config);
		if(response.result !== "OK"){
		const newFormData = { ...formData };  
		delete newFormData["pw"];
		setFormData(newFormData);
		alert(response.result);
		}
		else{
		window.localStorage.setItem('loginCheck', "ok");
		movePage("/passwordLess/main");
		}
	}

	else if(selPasswordNo === 2) {
		if(loginStatus === true){
			setLoginButton("로그인");
			cancelLogin();
		}
			
		else{
			loginPasswordless();
		}
			
	}
	// Passwordless manage
	else if(selPasswordNo === 3){
		managePasswordless();
	}
	};
  

	const loginPasswordless = async () => {
	checkType.current = "LOGIN";

	var existId = await passwordlessCheckID("");
	// console.log("existId=" + existId);

		if(existId === "T") {
			var token = await getTokenForOneTime();
			
			if(token !== "") {
				setLoginButton("취소");
				setloginStatus(true);
				lStatus = true;
				loginPasswordlessStart(token);
			}
		}
		else if(existId === "F") {
			alert("Passwordless 서비스에 등록되어 있지 않습니다. Passwordless 등록이 필요합니다.");
		}
		else {
			alert(existId);
		}
	}

	const getTokenForOneTime = async () => {
		let ret_val = "";
		const method = "post";
		const url = "http://localhost/evlink/api/PLogin/passwordlessCallApi";
		const reqeustData = {
			url: "getTokenForOneTimeUrl",
			params: "userId=" + formData.id
		}
		const data = qs.stringify(reqeustData);
		const config = {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		};
		const response = await common.apiRequest(method, url, data, config);
		var jsonData = JSON.parse(response.data);
		var msg = jsonData.msg;
		var code = jsonData.code;
		
		if(code === "000" || code === "000.0") {
			var oneTimeToken = response.oneTimeToken;
			ret_val = oneTimeToken;
		}
		else {
			alert("일회용 토큰 요청 오류 : [" + code + "] " + msg);
		}
		return ret_val;
	}

const passwordlessCheckID = async (QRReg: string) => {
	let ret_val = "";
	const method = "post";
	const url = "http://localhost/evlink/api/PLogin/passwordlessCallApi";
	const reqeustData = {
		url: "isApUrl",
		params: "userId=" + formData.id + "&QRReg=" + QRReg
	}
	const data = qs.stringify(reqeustData);
	const config = {
	  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	};
	const response = await common.apiRequest(method, url, data, config);
	var strResult = response.result;
	if(strResult === "OK") {
		var resultData = response.data;
		var jsonData = JSON.parse(resultData);
		var msg = jsonData.msg;
		var code = jsonData.code;
		
		if(code === "000" || code === "000.0") {
			var exist = jsonData.data.exist;
			if(exist)	ret_val = "T";
			else		ret_val = "F";
		}
		else {
			ret_val = msg;
		}	
	}
	else {
		ret_val = strResult;
	}
	return ret_val;
}


	const loginPasswordlessStart = async (token: string) => {
		const method = "post";
		const url = "http://localhost/evlink/api/PLogin/passwordlessCallApi";
		let reqeustData = {
			url: "getSpUrl",
			params: "userId=" + formData.id + "&token=" + token
		}
		var data = qs.stringify(reqeustData);
		const config = {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		};
		const response = await common.apiRequest(method, url, data, config);
		var resultData = response.data;
		var jsonData = JSON.parse(resultData);
		var msg = jsonData.msg;
		var code = jsonData.code;
		
		// console.log("msg [" + msg + "] code [" + code + "]");
		// console.log(jsonData.data);
		if(code === "000" || code === "000.0") {
			var term = jsonData.data.term;
			servicePassword = jsonData.data.servicePassword;
			setTempPassword(servicePassword);
			pushConnectorUrl = jsonData.data.pushConnectorUrl;
			pushConnectorToken = jsonData.data.pushConnectorToken;
			sessionId = response.sessionId;
			
			window.localStorage.setItem('session_id', sessionId);
			
			var today = new Date();
			passwordlessMillisec.current = today.getTime();
			passwordlessTerms.current = term - 1;
			// console.log("term=" + term + ", servicePassword=" + jsonData.data.servicePassword);

			drawPasswordlessLogin();
			connWebSocket();
		}
		else if(code === "200.6") {
			sessionId = window.localStorage.getItem('session_id') || "";		//console.log("Already request authentication --> send [cancel], sessionId=" + sessionId);
			
			if(sessionId !== undefined && sessionId != null && sessionId !== "") {
				const method = "post";
				const url = "http://localhost/evlink/api/PLogin/passwordlessCallApi";
				reqeustData = {
					url: "cancelUrl",
					params: "userId=" + formData.id + "&sessionId=" + sessionId
				}
				var data = qs.stringify(reqeustData);
				const config = {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
				};
				const response = await common.apiRequest(method, url, data, config);
				var resultData = response.data;
				var jsonData = JSON.parse(resultData);
				var msg = jsonData.msg;
				var code = jsonData.code;

				if(code === "000" || code === "000.0") {
					window.localStorage.removeItem('session_id');
					setTimeout(() => loginPasswordlessStart(token), 500);
				}
				else {
					cancelLogin();
					alert("잠시 후 다시 시도하세요.");	// Try again later.
				}
			}
			else {
				cancelLogin();
				alert("잠시 후 다시 시도하세요.");	// Try again later.
			}
		}
		else if(code === "200.7") {
			cancelLogin();
			alert("Passwordless 계정이 중지되었습니다.\n계정관리자에게 문의하세요.");	
		}
	}

	const drawPasswordlessLogin = async () => {
		var today = new Date();
		var gap_second = Math.ceil((today.getTime() - passwordlessMillisec.current) / 1000);
		if(lStatus === true) {
			if(gap_second < passwordlessTerms.current) {
			
				var today = new Date();
				var now_millisec = today.getTime();
				var gap_millisec = now_millisec - checkMillisec;
				
				if(gap_millisec > 1500) {
					setCheckMillisec(today.getTime());
					//loginPasswordlessCheck();	// polling
				}
		
				gap_millisec = now_millisec - passwordlessMillisec.current;
				var ratio = 100 - (gap_millisec / passwordlessTerms.current / 1000) * 100 - 1;
				if(ratio > 0) {
					var password = "";
					if(servicePassword.length === 6){
						password = servicePassword.slice(0, 3) + " " + servicePassword.slice(3, 6);
					}
					if(lStatus === true) {
						setWidth(ratio);
						setTempPassword(password);
					}
				}
				
				// setTimeoutId(setTimeout(drawPasswordlessLogin, 100));
				if(!timerCheck) {
					timer = setInterval(() => { drawPasswordlessLogin(); }, 1000); 
					setTimeoutId(timer);
					timerCheck = true;
				}
			}
			else {
				clearTimeout(timeoutId || undefined);
				// $("#rest_time").html("0 : 00");
				setloginStatus(false);
				lStatus = false;					
				setLoginTitle("Passwordless 로그인");			
				setWidth(0);		
				setTempPassword("--- ---");			
				// $("#login_mobile_check").hide();			
				
				window.localStorage.removeItem('session_id');
				
				setTimeout(() => alert("Passwordless 로그인 시간이 만료되었습니다."), 100);	
				clearInterval(timer);
				//setTimeout(() => cancelLogin(), 100);	
			}
		}
	}

	const connWebSocket = async () => {

		qrSocket.current = new WebSocket(pushConnectorUrl);

		qrSocket.current.onopen = function(e) {
			console.log("######## WebSocket Connected ########");
			var send_msg = '{"type":"hand","pushConnectorToken":"' + pushConnectorToken + '"}';
			console.log("url [" + pushConnectorUrl + "]");
			console.log("send [" + send_msg + "]");
			qrSocket.current?.send(send_msg);
		}

		qrSocket.current.onmessage = async function (event) {
			console.log("######## WebSocket Data received [" + qrSocket.current?.readyState + "] ########");
			
			try {
				if (event !== null && event !== undefined) {
					var result = await JSON.parse(event.data);
					if(result.type === "result") {
						if(checkType.current === "LOGIN")
							loginPasswordlessCheck();
						else if(checkType.current === "QR")
							regPasswordlessOK();
					}
				}
			} catch (err) {
				console.log(err);
			}
		}

		qrSocket.current.onclose = function(event) {
			if(event.wasClean)
				console.log("######## WebSocket Disconnected - OK !!! [" + qrSocket.current?.readyState + "] ########");
			else
				console.log("######## WebSocket Disconnected - Error !!! [" + qrSocket.current?.readyState + "] ########");

			// console.log("=================================================");
			// console.log(event);
			// console.log("=================================================");
		}

		qrSocket.current.onerror = function(error) {
			console.log("######## WebSocket Error !!! [" + qrSocket.current?.readyState + "] ########");
			console.log("=================================================");
			console.log(error);
			console.log("=================================================");
			setsocketCheck(false);
		}
	}

	const loginPasswordlessCheck = async () =>{
		
		//console.log("----- loginPasswordlessCheck -----");

		var today = new Date();
		var now_millisec = today.getTime();
		var gap_millisec = now_millisec - passwordlessMillisec.current;
		sessionId = sessionId = window.localStorage.getItem('session_id') || "";
		if(gap_millisec < passwordlessTerms.current * 1000 - 1000) {
			const method = "post";
				const url = "http://localhost/evlink/api/PLogin/passwordlessCallApi";
				var reqeustData = {
					url: "resultUrl",
					params: "userId=" + formData.id + "&sessionId=" + sessionId
				}
				var data = qs.stringify(reqeustData);
				const config = {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
				};
				const response = await common.apiRequest(method, url, data, config);
				var resultData = response.data;
				var jsonData = JSON.parse(resultData);
				var msg = jsonData.msg;
				var code = jsonData.code;
				
				if(code === "000" || code === "000.0") {
					
					var auth = jsonData.data.auth;
					if(auth === "Y") {
						clearInterval(timer);
						window.localStorage.removeItem('session_id');
						window.localStorage.setItem('loginCheck', "ok");
						// alert("Login OK");
                                                checkLogin();
						movePage("/");
					}
					else if(auth === "N") {
						cancelLogin();
						setTimeout(() => alert("인증을 거부하였습니다."), 100);
					}
					else{
						alert("인증 대기중 입니다.");
					}
				}
			}
	}

	const regPasswordlessOK = async () => {
	var existId = await passwordlessCheckID("T");
	if(existId === "T") {
		console.log(timeoutId);
		clearTimeout(timeoutId || undefined);
		// $("#login_content").hide();
		// $("#passwordless_reg_content").show();
		cancelManage();
	}
	else{
		alert("QR 코드 등록 대기중 입니다.");
	}
	}

	const mobileCheck = () => {
	if(checkType.current === "LOGIN")
		loginPasswordlessCheck();
	else if(checkType.current === "QR")
		regPasswordlessOK();
	};

	const managePasswordless = async () => {
	var id = formData.id === undefined ? "" : formData.id;
	var pw = formData.pw === undefined ? "" : formData.pw;

		// 상태 초기화
		setIdCheck(false);
		setQrcheck(false);
		setRegisterKey("");
		setServerUrl("");
		setPasswordlessToken("");

		if(id === "") {
			alert("아이디를 입력하세요.");	
			return false;
			}
		
			if(pw === "") {
				alert("비밀번호를 입력하세요.");	
			return false;
			}

	const method = "post";
    const url = "http://localhost/evlink/api/PLogin/passwordlessManageCheck";
    var reqeustData = {
      id: formData.id,
      pw: formData.pw
    }
    var data = qs.stringify(reqeustData);
    const config = { withCredentials: true }
    const response = await common.apiRequest(method, url, data, config);

	if(response.result === "OK"){
		setPasswordlessToken(response.PasswordlessToken);
	}
	else{
		alert(response.result);
		const newFormData = { ...formData };  
        delete newFormData["pw"];
        setFormData(newFormData);
	}
	
	if(response.PasswordlessToken !== "" && response.PasswordlessToken !== undefined ) {
		var existId = await passwordlessCheckID("");
		if(existId === "T") {
			setIdCheck(true);
			// $("#login_content").hide();
			// $("#passwordless_unreg_content").show();
		}
		else {
			getPasswordlessQRinfo(response.PasswordlessToken);
		}
	}
  };

	const getPasswordlessQRinfo = async (PasswordlessToken: string) => {
		checkType.current = "QR";

		const id = formData.id;
		const method = "post";
		const url = "http://localhost/evlink/api/PLogin/passwordlessCallApi";
		const reqeustData = {
			url: "joinApUrl",
			params: "userId=" + id + "&token=" + PasswordlessToken
		}
		const data = qs.stringify(reqeustData);
		const config = {
			withCredentials: true,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		};
		const response = await common.apiRequest(method, url, data, config);
		const resultData = response.data;
		const jsonData = JSON.parse(resultData);
		const msg = jsonData.msg;
		const code = jsonData.code;
		// console.log("msg [" + msg + "] code [" + code + "]");
		
		if(code === "000" || code === "000.0") {
			const qrData = jsonData.data;
			// console.log("------------ info -----------");
			// console.log(qrData);
			
			const qr = qrData.qr;
			const corpId = qrData.corpId;
			let registerKey = qrData.registerKey;
			const terms = qrData.terms;
			const serverUrl = qrData.serverUrl;
			const userId = qrData.userId;
			
			// console.log("qr: " + qr);
			// console.log("corpId: " + corpId);
			// console.log("registerKey: " + registerKey);
			// console.log("terms: " + terms);
			// console.log("serverUrl: " + serverUrl);
			// console.log("userId: " + userId);
			
			pushConnectorUrl = qrData.pushConnectorUrl;
			pushConnectorToken = qrData.pushConnectorToken;
			
			// console.log("pushConnectorUrl: " + pushConnectorUrl);
			// console.log("pushConnectorToken: " + pushConnectorToken);
			
			// $("#login_content").hide();
		
			
			let tmpRegisterKey = "";
			const tmpInterval = 4;
			for(let i=0; i<registerKey.length / tmpInterval; i++) {
				tmpRegisterKey = tmpRegisterKey + registerKey.substring(i*tmpInterval, i*tmpInterval + tmpInterval);
				if(registerKey.length > i*tmpInterval)
					tmpRegisterKey = tmpRegisterKey + " ";
			}
			registerKey = tmpRegisterKey;
			
			setServerUrl(serverUrl);
			setRegisterKey(registerKey);
			setSelPasswordNo(4);
			setIdCheck(true);
			setQrcheck(true);
			setqrSrc(qr);
			
			const today = new Date();
			passwordless_milisec = today.getTime();
			passwordless_terms = terms - 1;
			check_millisec = today.getTime();
			
			drawPasswordlessReg();
			connWebSocket();
		}
		else {
			alert("[" + code + "] " + msg);
		}
	}

	const drawPasswordlessReg = async () => {
		
		var id = formData.id;
		var today = new Date();
		var gap_second = Math.ceil((today.getTime() - passwordless_milisec) / 1000);
		
		if(gap_second < passwordless_terms) {
		
			var tmp_min = Math.ceil((passwordless_terms - gap_second) / 60);
			var tmp_sec = Math.ceil((passwordless_terms - gap_second) % 60);
			
			// if(tmp_sec < 10)
			// 	tmp_sec = "0" + tmp_sec;
			
			setTmp_min(tmp_min);
			setTmp_sec(tmp_sec);
			
			if(!timerCheck) {
				timer = setInterval(() => { drawPasswordlessReg(); }, 1000); 
				setTimeoutId(timer);
				timerCheck = true;
			}
			
			var today = new Date();
			var now_millisec = today.getTime();
			var gap_millisec = now_millisec - check_millisec;
			if(gap_millisec > 1500) {
				check_millisec = today.getTime();
				
			}
		}
		else {
			clearTimeout(timeoutId || undefined);
			clearInterval(timer);
			timerCheck = false;
			
			// $("#login_content").show();
			// $("#passwordless_reg_content").hide();
			
			setTimeout(() => alert("Passwordless QR 등록시간이 만료되었습니다."), 100);	
			cancelManage();
		}
	}

	const unregPasswordless = async () => {
		if(window.confirm("Passwordless 서비스를 해지하시겠습니까?")) {
			var id = formData.id;
			const method = "post";
			const url = "http://localhost/evlink/api/PLogin/passwordlessCallApi";
			var reqeustData = {
				url: "withdrawalApUrl",
				params: "userId=" + id + "&token=" + PasswordlessToken
			}
			var data = qs.stringify(reqeustData);
			const config = {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				withCredentials: true,
			};
			const response = await common.apiRequest(method, url, data, config);
			var strResult = response.result;
			if(strResult === "OK") {
				var resultData = response.data;
				var jsonData = JSON.parse(resultData);
				var msg = jsonData.msg;
				var code = jsonData.code;
				
				//console.log("data=" + data);
				//console.log("msg [" + msg + "] code [" + code + "]");
				
				if(code === "000" || code === "000.0") {
					window.localStorage.removeItem('passwordless');
					alert("Passwordless 서비스가 해지되었습니다.\n\nSNS로 로그인하세요.\n\nPasswordless로 로그인하고 싶다면\nPasswordless 서비스를 먼저 등록하세요.");	
					setSelPasswordNo(1);
					setIdCheck(false);
					cancelManage();
				}
				else {
					cancelManage();
					alert("[" + code + "] " + msg);
				}
			}
			else {
				cancelManage();
				alert(strResult);
			}
		}
	};

	const cancelManage = () => {

		if (qrSocket.current) {
			qrSocket.current.close();
		}
		
		timerCheck = false;
		clearInterval(timeoutId || undefined);
		clearInterval(timer);
		setIdCheck(false);
		setQrcheck(false);
		setRegisterKey("");
		setServerUrl("");
		setPasswordlessToken("");
		selPassword(2);
	};

	const copyTxt1 = () => {
		if (serverUrlRef.current) {
			const range = document.createRange();
			range.selectNodeContents(serverUrlRef.current); 
	
			const selection = window.getSelection();
			selection?.removeAllRanges(); 
			selection?.addRange(range); 
		
			try {
			document.execCommand("copy"); 
			alert("서버 URL이 복사되었습니다.");
			} catch (err) {
			console.error("Failed to copy text: ", err);
			}
	
			selection?.removeAllRanges(); 
		}
	};

	const copyTxt2 = () => {
		if (registerKeyRef.current) {
			const range = document.createRange();
			range.selectNodeContents(registerKeyRef.current); 
	
			const selection = window.getSelection();
			selection?.removeAllRanges(); 
			selection?.addRange(range); 
	
			try {
			document.execCommand("copy"); 
			alert("등록코드가 복사되었습니다.");
			} catch (err) {
			console.error("Failed to copy text: ", err);
			}
	
			selection?.removeAllRanges(); 
		}
	};

	const cancelLogin = async() => {
		timerCheck = true;
		clearInterval(timeoutId || undefined);
		clearInterval(timer);

		setLoginTitle("Passwordless 로그인");
		setWidth(0);		
		setTempPassword("--- ---");
		setLoginButton("취소");
		
		var id = formData.id;
		sessionId = window.localStorage.getItem('session_id') || "";
		const method = "post";
		const url = "http://localhost/evlink/api/PLogin/passwordlessCallApi";
		var reqeustData = {
			url: "cancelUrl",
			params: "userId=" + id + "&sessionId=" + sessionId
		}
		var data = qs.stringify(reqeustData);
		const config = {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		};
		const response = await common.apiRequest(method, url, data, config);
		var resultData = response.data;
		var jsonData = JSON.parse(resultData);
		var msg = jsonData.msg;
		var code = jsonData.code;
		window.localStorage.removeItem('session_id');
		setLoginButton("로그인");
		setloginStatus(false);
		if (qrSocket.current) {
			qrSocket.current.close();
		}
	};   

    return (
      <div className="main_container">
      <div className="modal">
        <div style={{ width: '100%', textAlign: 'right' }}>
        </div>
        <div className="login_article">
          <div className="title">
            <em style={{ width: '100%', textAlign: 'center' }} id="login_title">{t(`${loginTitle}`)}</em>
          </div>
          <div className="content">
		  {idCheck === false &&
            <div id="login_content">
              <form id="frm">
                <div className="input_group">
                  <input type="text" id="id" name="id" placeholder="ID" value={formData.id || ""} onChange={changeInput} />
                </div>
                {(selPasswordNo === 1 || selPasswordNo === 3)  &&
                  <div className="input_group" id="pw_group">
                    <input type="password" id="pw" name="pw" value={formData.pw || ""} placeholder="PASSWORD" onChange={changeInput} />
                  </div>
                }       
              </form>
              {selPasswordNo === 2 &&
                <div className="input_group" id="bar_group">
                  <div
                    className="timer"
                    id="bar_content"
                    style={{
                      position: 'relative',
                      background: 'url("./images/passwordLess/timerBG.png") no-repeat center right',
                      borderRadius: 8,
                      backgroundSize: 'cover',
                    }}
                  >
                    <div
                      className="pbar"
                      id="passwordless_bar"
                      style={{
                        background: 'rgb(55 138 239 / 70%)',
                        height: 50,
                        width: `${width}%`,
                        borderRadius: 8,
                        animationDuration: '0ms',
                      }}
                    />
                    <div
                      className="OTP_num"
                      id="passwordless_num"
                      style={{
						textShadow: 'rgba(0, 0, 0, 0.7) 2px 2px 3px',
						top: '0px',
						position: 'absolute',
						fontSize: '22px',
						color: 'rgb(255, 255, 255)',
						textAlign: 'center',
						height: '50px',
						width: '100%',
						lineHeight: '50px',  
						fontWeight: 800,
						letterSpacing: '1px'
                      }}
                  >
                    {tmpPassword}
                  </div>
                </div>
              </div>
              }
              <div className="pwless_info" style={{display: `${showHelp}`}}>
                <button onClick={() => hide_help()} className="cbtn_ball" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <img src={process.env.PUBLIC_URL + "/images/passwordLess/ic_fiicls.png"} height={20} alt="close" />
                </button>
                <p>
                  Passwordless 서비스는 보안성과 편리성을 갖춘 무료 인증 서비스입니다.
                  <br />
                  <br />
                  Passwordless 서비스를 이용하기 위해서는 스마트폰에 Passwordless X1280앱을 설치 한 후 QR코드를 스캔하여 이용할 수 있습니다.
                  <br />
                  <br />
                </p>
                <p style={{ width: '100%', textAlign: 'center', fontSize: '140%', fontWeight: 800 }}>
                  <span style={{ color: "#5555FF" }}>Passwordless X1280 Mobile App</span>
                  <br />
                  <br />
                  <a href="https://apps.apple.com/us/app/autootp/id1290713471" target="_new_app_popup" rel="noopener noreferrer">
                    <img src={process.env.PUBLIC_URL + "/images/passwordLess/app_apple_icon.png"} style={{ width: '45%' }} alt="Apple App Store" />
                  </a>
                  &nbsp;
                  <a href="https://play.google.com/store/apps/details?id=com.estorm.autopassword" target="_new_app_popup" rel="noopener noreferrer">
                    <img src={process.env.PUBLIC_URL + "/images/passwordLess/app_google_icon.png"} style={{ width: '45%' }} alt="Google Play Store" />
                  </a>
                  <br />
                  <img src={process.env.PUBLIC_URL + "/images/passwordLess/app_apple_qr.png"} style={{ width: '45%' }} alt="Apple QR" />
                  &nbsp;
                  <img src={process.env.PUBLIC_URL + "/images/passwordLess/app_google_qr.png"} style={{ width: '45%' }} alt="Google QR" />
                </p>
                <br />
                제공되는 Passwordless 서비스는 UN산하 국제기술표준기구인 ITU-T가 X.1280으로 권고하는 표준 기술로 본 온라인 서비스가 사용자에게 무료로 제공 중에 있습니다.
                <br />
                <br />
                Passwordless를 통해 안전하고 편리한 나만의 온라인 서비스를 만들어 보세요!
                <p />
              </div>
			  {selPasswordNo === 3 &&
				<div id="passwordlessNotice">
					<div style={{ textAlign: 'center', lineHeight: '24px' }}>Passwordless 서비스를 등록 하려면<br></br>사용자 인증이 필요합니다.</div>
				</div>
				}
              <div className="btn_zone">
                <button onClick={() => login()} className="btn active_btn" id="btn_login" >
                  {t(`${loginbutton}`)}
                </button>
              </div>
				{socketCheck === false &&
				<div className="btn_zone" id="login_mobile_check">
					<button onClick={() => mobileCheck()} className="btn active_btn" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
					모바일 인증 후 확인
					</button>
				</div>
				}
				{selPasswordNo === 1 &&
					<div className="menbership" id="login_bottom1" style={{ textAlign: 'center' }}>
						<Link to="/passwordLess/join">회원가입</Link>
						<Link to="/passwordLess/changepw">비밀번호찾기</Link>
					</div>
				}
				{selPasswordNo === 2 &&
					<div className="menbership" id="login_bottom2" style={{ textAlign: 'center'}}>
						<Link to="/passwordLess/join">회원가입</Link>
						<button onClick={() => selPassword(3)} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
						<span style={{ fontWeight: 800 }}>Passwordless 등록/해지</span>
						</button>
                        <span style={{ display: 'inline-block', padding: '6px 10px 16px 10px', textAlign: 'right' }}>
                            <button onClick={() => show_help()} className="cbtn_ball" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <img src={process.env.PUBLIC_URL + "/images/passwordLess/help_bubble.png"} style={{ width: 16, height: 16, border: 0 }} alt="help" />
                            </button>
                        </span>
					</div>
				}
				{selPasswordNo === 3 &&
					<div className="menbership" id="manage_bottom" style={{textAlign: 'center' }}>
						<Link to="/passwordLess/changepw">비밀번호찾기</Link>
						<button onClick={() => cancelManage()} style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
						<span style={{ fontWeight: 800 }}>로그인</span>
						</button>
					</div>
				}
                {/* {selPasswordNo < 3 &&
				<div id="passwordlessSelButton" style={{ height: 30, marginTop: 10, marginBottom: 10 }}>
					<div style={{ textAlign: 'center' }}>
					<span style={{ display: 'inline-block', padding: '6px 10px 16px 10px', textAlign: 'right' }}>
						<label
						htmlFor="selLogin1"
						style={{ margin: 0, padding: 0, fontFamily: '"Noto Sans KR", sans-serif', fontWeight: 300, fontSize: 'medium' }}
						>
						<input type="radio" id="selLogin1" name="selLogin" defaultValue={1} onChange={() => selPassword(1)} checked={selPasswordNo === 1} />
						Password
						</label>
					</span>
					<span style={{ display: 'inline-block', padding: '6px 10px 16px 10px', textAlign: 'right' }}>
						<label
						htmlFor="selLogin2"
						style={{ margin: 0, padding: 0, fontFamily: '"Noto Sans KR", sans-serif', fontWeight: 300, fontSize: 'medium' }}
						>
						<input className="radio_btn" type="radio" id="selLogin2" name="selLogin" defaultValue={2} onChange={() => selPassword(2)} checked={selPasswordNo === 2 || selPasswordNo === 3} />
						Passwordless
						</label>
					</span>
					</div>
				</div>
				} */}
            </div>
			}
			{registerKey !== "" &&
				<div id="passwordless_reg_content">
				<div style={{ textAlign: 'center' }}>
					<span style={{ width: '100%', textAlign: 'center', fontWeight: 500, fontSize: 24 }}>
					<br />
					Passwordless 서비스 등록
					</span>
					<br />
					<img id="qr" src={qrSrc} width="300px" height="300px"  style={{ display: 'inline-block', marginTop: 10 }} alt="QR Code" />
					<p style={{ width: '100%', padding: '0% 0%', fontWeight: "500px", fontSize: "16px", lineHeight: "24px" }}>스마트폰에 Passwordless X1280앱을</p>
					<br />
					<span style={{ display: 'inline-block', width: '100%', fontSize: 18, padding: 10, marginBottom: 20 }}>
					<div style={{ gap: 10, display: 'flex', justifyContent: 'center', margin: '8px 0', fontSize: 13 }}>
						<div style={{ width: '88%', textAlign: 'left' }}>
						<span style={{ width: '30%' }}>[ 서버 URL ]</span>
						<span ref={serverUrlRef} id="server_url" style={{ fontWeight: 800 }}>{serverUrl}</span>
						</div>
						<div style={{ width: '10%' }}>
						<img src={process.env.PUBLIC_URL + "./images/passwordLess/ic-copy.png"} onClick={() => copyTxt1()} alt="copy" style={{ cursor: 'pointer' }} />
						</div>
					</div>
					<div style={{ gap: 10, display: 'flex', justifyContent: 'center', margin: '8px 0', fontSize: 13 }}>
						<div style={{ width: '88%', textAlign: 'left' }}>
						<span style={{ width: '30%' }}>[ 등록 코드 ]</span>
						<span ref={registerKeyRef} id="register_key" style={{ fontWeight: 800 }}>{registerKey}</span>
						</div>
						<div style={{ width: '10%' }}>
						<img src={process.env.PUBLIC_URL + "./images/passwordLess/ic-copy.png"} onClick={() => copyTxt2()} alt="copy" style={{ cursor: 'pointer' }} />
						</div>
					</div>
					<br />
					<b>
						<span id="rest_time" style={{ fontSize: 24, textShadow: '1px 1px 2px rgba(0,0,0,0.9)', color: '#afafaf' }}>{tmp_min} : {tmp_sec}</span>
					</b>
					</span>
				</div>
				<div className="btn_zone">
					<button onClick={() => cancelManage()} className="btn active_btn" id="btn_login">
					취소
					</button>
				</div>
				{socketCheck === false &&
					<div className="btn_zone" id="reg_mobile_check">
						<button onClick={() => mobileCheck()} className="btn active_btn" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
						모바일 인증 후 확인
						</button>
					</div>
				}
				</div>
			}	
            <input type="hidden" id="passwordlessToken" name="passwordlessToken" defaultValue="" />
			{idCheck === true && qrCheck === false &&
            <div id="passwordless_unreg_content" style={{width: '100%', textAlign: 'center', fontWeight: 500, fontSize: 24, lineHeight: "35px" }}>
              Passwordless 서비스 해지
              <br />
              <br />
              <div className="passwordless_unregist">
                <div style={{ padding: 0 }}>
                  <button
                    type="button"
                    id="btn_unregist"
                    name="btn_unregist"
                    style={{
                      height: 120,
                      borderRadius: 4,
                      color: '#FFFFFF',
                      background: '#3C9BEE',
                      borderColor: '#3090E0',
                      padding: '4px 20px',
                      fontSize: '20px',
                      lineHeight: '40px',
                    }}
					onClick={() => unregPasswordless()}
                  >
                    Passwordless 서비스
					<br></br>
					해지하기
                  </button>
                </div>
                <div>
                  &nbsp;
                  <br />
                  <p style={{ width: '100%', padding: '0% 0% 0%', fontWeight: 500, fontSize: "16px", lineHeight: "24px" }}>
                    Passwordless서비스를 해지하면
					<br></br>
					사용자 패스워드로 로그인해야 합니다.
                  </p>
                </div>
                <br />
                <div className="btn_zone">
                  <button onClick={() => cancelManage()} className="btn active_btn" id="btn_login">
                    취소
                  </button>
                </div>
              </div>
            </div>
			}
          </div>
        </div>
      </div>
    </div>
    
    );
}

export default Login;
