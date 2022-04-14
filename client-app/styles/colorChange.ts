import palette from "./palette";


const colorChange = (color: string) => {
    if (color === 'green_8D') {
        color = palette.green_8D;
    }
    else if (color === 'gray_D9') {
        color = palette.gray_D9;
    }
    else if (color === "green_53") {
        color = palette.green_53;
    }
    else if (color === "blue_fb") {
        color = palette.blue_fb;
    }
    else if (color === "black") {
        color = palette.black;
    }
    else if (color === "gray_cd") {
        color = palette.gray_cd;
    }
    else if (color === "gray_eb"){
        color = palette.gray_eb;
    }
    else if (color === "gray_48"){
        color = palette.gray_48;
    }
    else if (color === "gray_71"){
        color = palette.gray_71;
    }
    else if (color === "gray_76"){
        color = palette.gray_76;
    }
    else if (color === "gray_80"){
        color = palette.gray_80;
    }
    else if (color === "gray_85"){
        color = palette.gray_85;
    }
    else if(color === "dark_cran"){
        color = palette.dark_cyan;
    }
    return color;
};

export default colorChange;  