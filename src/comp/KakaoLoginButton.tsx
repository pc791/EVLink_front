import React, { useEffect } from 'react'
import { useAuth } from './AuthProvider';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
//KakaoLoginButton.tsx

//전역으로 선언
declare global {
   interface Window { //실제 존재하는 윈도 객체에 커스터 마이징을 해서 카카오 타입을 지정
         Kakao: any;  //Kakao SDK의 사용을 하기 위해서 등록 
    }
}
const KakaoLoginButton: React.FC = () => {
    //로그인 여부 
    const { checkLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    let from = '/';
    const state = location.state as { from?: Location };
    if (state?.from?.pathname) {
        from = state.from.pathname;
    } else if (searchParams.get('from')) {
        from = searchParams.get('from')!;
    }
    //Kakao SDK에서 제공하는 메서드.
    //isInitialized() => Kakao 객체가 없거나 초기화되지 않았을 때 true 반환
    //카카오 SDK가 아직 초기화되지 않았다면 초기화하라
    useEffect(() => {
        if (!window.Kakao?.isInitialized()) {
            window.Kakao.init('6dea7b73bcc0299466542f4fe9672301');
        }
    }, [])

    const handleKakaoLogin2 = () => {
        //이전 스토리지를 삭제 - 혹시 몰라서 .....
        localStorage.removeItem('kakao_id_token');

        //카카오 로그인 정보를  서비스에 전송 window.Kakao.Auth.login({})
        window.Kakao.Auth.login({
            throughTalk: false, //무조건 웹으로 로그인 창을 출력
            persistAccessToken: false, // 자동으로 localStorage에 저장하지 말아라
            success: async function (authObj: any) {
                //OpenID Connect 선택했기 때문에 토큰이 발급이 됨
                //OpenID Connect 활성화 설정 Open
                const idToken = authObj.id_token;
                localStorage.setItem('kakao_id_token', idToken);
                window.Kakao.API.request({
                    url: '/v2/user/me',//본인의 키값으로 로그인 요청 url
                    success: async function (res: any) {
                        // login이 성공하면 응답으로 동의 화면에서 설정한 키값을 받을 수 있음.
                        // profile_nickname , account_email
                        console.log(res);
                        const email = res.kakao_account.email;
                        const nickname = res.kakao_account.profile.nickname;
                        console.log(`nickname => ${nickname}`);
                        console.log(`email => ${email}`);
                        //BackEnd로 카카오 인증된 정보를 json으로 전송 [@RequestBody MemberVO vo]
                        try {
                            const response = await axios.post('http://192.168.0.92/myictstudy0521/api/login/kakao',{
                                userid:email,
                                email:email,
                                password:'ict',
                                name:nickname,
                            },{
                                withCredentials:true,
                                headers:{
                                    'Content-Type':'application/json'
                                }
                            });
                            if(response.data === 'success'){
                                alert(`${nickname}님 환영합니다.`);
                                await checkLogin();
                                navigate(from, {replace:true});
                            }else{
                                alert("문제가 발생!!!!!")
                            }
                        } catch (error) {
                             console.error('카카오 로그인 요청 오류', error);
                             alert('서버 오류가 발생했습니다.');
                        }
                    },
                    fail:function(err:any){
                        console.error('카카오 로그인 실패', err);
                        alert('카카오 로그인 실패');
                    }
                });
            }
        });
    }
    return (
        <button
            onClick={handleKakaoLogin2}
            style={{
                background: '#FEE500',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                fontWeight: 'bold',
            }}
        > Kakao 로그인
        </button>
    )
}
export default KakaoLoginButton