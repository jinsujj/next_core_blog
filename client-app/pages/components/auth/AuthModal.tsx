import React from "react";
import styled from "styled-components";
import { useSelector } from "../../../store";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

const Container = styled.div`
    z-index: 11;
`;

interface IProps {
    closeModal: () => void;
}

const AuthModal = ({closeModal}:IProps) => {
    const authMode = useSelector((state) => state.auth.authMode);
    console.log(authMode);
    return (
        <Container>
            {authMode === "signup" && <SignUpModal closeModal={closeModal}/>}
            {authMode === "login" && <LoginModal closeModal={closeModal}/>}
        </Container>
    );
}

export default AuthModal;