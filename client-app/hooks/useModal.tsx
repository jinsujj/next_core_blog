import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 11;
  .modal-background {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
  }
`;

const useModal = () =>{
    const [modalOpened, setModalOpened] = useState(false);

    const openModal = () => {
        setModalOpened(true);
    }
    
    const closeModal = () => {
        setModalOpened(false);
    }

    interface IProps {
        children: React.ReactNode;
    }

    const ModalPortal: React.FC<IProps> = ({ children}) => {
        const ref = useRef<Element | null>();
        const [mounted, setMounted] = useState(false);

        useEffect(() => {
            setMounted(true);
            if(document){
                const dom = document.querySelector("#root-modal");
                ref.current = dom;
            }
        },[]);
        
        if(ref.current && mounted && modalOpened) {
            return createPortal(
                <Container>
                  <div
                    className="modal-background"
                    role="presentation"
                    onClick={closeModal}
                  />
                  {children}
                </Container>,
                ref.current
              );
        }
        return null;
    };

    return {
        openModal,
        closeModal,
        ModalPortal
    };
};

export default useModal;