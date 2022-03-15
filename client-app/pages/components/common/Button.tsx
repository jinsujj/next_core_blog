import React from "react";
import styled from "styled-components";

interface StyledProps {
    width: string;
}

const Container = styled.button<StyledProps>`
    width: ${(props) =>props.width};
    height: 40px;
    padding: 0 16px;
    margin-right: 5px;

    border: 1px solid #18a0fb;
    box-sizing: border-box;
    border-radius: 4px;

    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    color: #18a0fb;
    background: white;
    font-size: 16px;
    font-weight: 500;

    &:hover{
        background: #18a0fb;
        color: white;
    }
`;

interface IProps {
    children : React.ReactNode;
    width?: string;
}

const Button = ({children, width, ...props}: IProps) => {
    if(width === undefined) width= "130px";

    return (
        <Container {...props} width={width}>
            {children}
        </Container>
    )
};

export default React.memo(Button);