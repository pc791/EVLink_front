//src/global.d.ts
//typescript에서 필요한 모듈을 선언 
declare module '*.module.css' {
    const classes : { [key:string] : string};
    export default classes;
}
