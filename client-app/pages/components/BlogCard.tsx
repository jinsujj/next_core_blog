import React, { Children } from "react";
import styled from "styled-components";


const Container = styled.div`
    
    img {
        width: auto;
    }
`;

export interface IProps {
    children : React.ReactNode;
    noteId : number,
    thumbImage?: string,
}

const BlogCard = ({noteId, thumbImage}:IProps) =>{

    return (
        <Container>
            <img src={thumbImage} key={noteId}/>
        </Container>
    );
}


export default BlogCard;