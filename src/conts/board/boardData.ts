export interface BoardItem {
    id: number;
    title: string;
    writer: string;
    content: string;
}
//[{},{},{},...] =31개가 들어가는 배열 생성
// export const boardList: BoardItem[] = Array.from({ length: 11 }, (_, i) => (
//     {
//         id:i+1,
//         title:`테스형이 작성한 글 ${i+1}`,
//         writer:`테스형${i+1}`,
//         content:`테스형님이 작성한 글 ${i+1} 임`,
//     }
// ));
//localStorage 불러와서
//JSON.parse() : json(문자열) => 자바스크립트 객체로 변환
//JSON.strongify() : JSON.parse() 반대 즉, 자바스크립트 -> JSON *****
//localStorage.getItem('boardList')가 null일 경우 빈 배열 문자열 '[]'을 패싱
export const boardList: BoardItem[] = JSON.parse(localStorage.getItem('boardList') || '[]');