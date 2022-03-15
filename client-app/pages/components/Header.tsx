import Link from "next/link";
import React ,{useState} from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { useSelector } from "../../store";
import { commonState } from "../../store/common";
import Button from "./common/Button";
import Sidebar from "./Sidebar";

const Container = styled.div`
    border-bottom: 1px solid rgba(0,0,0,0.15);
    box-shadow : 0 0 5px rgba(0,0,0,0.15);
    background: white;

    position: relative;

    .inner {
        display: flex;
        max-width: 1200px;
        margin: 0 auto;
        box-sizing: border-box;
        position: relative;
        padding-left: 20px;
        padding-right: 20px;
    }

    .toggle-btn{
        background: url("../img/toggle_blue.svg");
        width: 28px;
        height: 18px;
        cursor: pointer;
        text-indent: -9999px;
        margin: 28px 0px;
    }

    .title-group{
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
    }

    .title-group .logo {
        background: url("../img/owl.svg");
        width: 36px;
        height: 36px;
        display: block;
        text-indent: -9999px;
    }
    .title-group a {
        display: block;
        padding: 21.5px 0;
        font-size: 24px;
        font-weight: bold;
        line-height: 29px;
    }

    .btn-group{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right:10px;
    }
`;


const Header = () => {
    const isToggle = useSelector((state) => state.common.toggle);
    const dispatch = useDispatch();

    const changeToggle = () =>{
        dispatch(commonState.setToggleMode(!isToggle));
        console.log(isToggle);
    }

    return (
        <>
        <Sidebar/>
        <Container>
            <div className="inner">
                <div className={`toggle-btn ${isToggle ? "on" : ""}`} onClick={changeToggle}>Header Menu Button</div>
                <div className="title-group">
                    <div className="logo">부엉이</div>
                    <Link href="/">
                        <a>부엉이 개발자</a>
                    </Link>
                </div>
                <div className="btn-group">
                    <Button>Login</Button>
                    <Button>Register</Button>
                </div>
            </div>
        </Container>
        </>
    );
}

export default  Header;