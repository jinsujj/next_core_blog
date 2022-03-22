import React, { useEffect, useState } from "react";
import styled from "styled-components";


const Container = styled.div`
    blockquote {
        padding: 10px 20px;
        margin : 0 0 20px;
        font-size: 17.5px;
        border-left: 5px solid #eee;
    }

    ul li  {
    padding: 5px 0px 5px 5px;
    margin-bottom: 5px;
    border-bottom: 1px solid #efefef;
    }

    ol li{
        margin-bottom: .5rem;
    }   


    pre{
        display: block;
        padding: 9.5px;
        margin: 0 0 10px;
        font-size: 13px;
        line-height: 1.42857143;
        color: #333;
        word-break: break-all;
        word-wrap: break-word;
        background-color: #f5f5f5;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
`;

const Editor = () => {
    const [data, setData] = useState();


    const onClickButton = () => {
        $('#summernote').summernote('focus');
        setData($('#summernote').summernote('code'));
    }

    useEffect(() => {
        $('#summernote').summernote({
            lang: 'ko-KR', // default: 'en-US'
            height: 500,
            tabsize: 3,
            toolbar: [
                ['style', ['style']],
                ['highlight', ['highlight']],
                ['insert', ['gxcode']],
                ['fontname', ['fontname']],
                ['fontsize', ['fontsize']],
                ['style', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
                ['color', ['forecolor', 'color']],
                ['table', ['table']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['insert', ['picture', 'link', 'video']],
                ['view', ['fullscreen', 'codeview']],
                ['help', ['help']]
            ],
            focus: true,
            fontNames: ['Arial', 'Courier New', '맑은 고딕', '굴림체', '굴림', '돋음체', 'Montserrat', 'Nanum Gothic', 'Nanum Gothic Coding', 'NanumHimNaeRaNeunMarBoDan', 'NanumBaReunHiPi'],
            fontNamesIgnoreCheck: ['Arial', 'Courier New', '맑은 고딕', '굴림체', '굴림', '돋음체', 'Montserrat', 'Nanum Gothic', 'Nanum Gothic Coding', 'NanumHimNaeRaNeunMarBoDan', 'NanumBaReunHiPi'],
            fontSizes: ['10', '11', '12', '14', '15', '16', '18', '20', '22', '24', '28', '30', '36', '50', '72'],
            callbacks: {
                onImageUpload: function (files) {
                    that = $(this);
                    sendFile(files[0], that);
                }
            },
        });
    }, []);

    return (
        <Container>
            <Container id="summernote" />
            <button onClick={onClickButton}>Button</button>
            {JSON.stringify(data)}
        </Container>
    )
};

export default Editor;