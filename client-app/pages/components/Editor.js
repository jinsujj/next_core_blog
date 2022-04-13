import { route } from "next/dist/server/router";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import noteApi from "../../api/note";
import palette from "../../styles/palette";
import Input from "./common/Input";


const Container = styled.div`
    .title_input {
    align-items: center;
    border: 1px solid ${palette.gray_cd};
    padding: 4px 4px 4px 4px;
    background-color: ${palette.gray_f5};
    }

    .title {
        align-items: center;
        padding-top: 1px;
    }

    blockquote {
        padding: 10px 20px;
        margin : 0 0 20px;
        font-size: 17.5px;
        border-left: 5px solid ${palette.blockQuote};
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

    .note-editor.note-airframe .note-editing-area .note-editable[contenteditable=false], .note-editor.note-frame .note-editing-area .note-editable[contenteditable=false] {
        background: white !important;
    }

    .note-editor.note-airframe, .note-editor.note-frame {
        border: 1px solid white !important;
    }
`;


const Editor = ({ NoteInfo, mode }) => {
    const [imageBuff, setImageBuff] = useState();
    const [data, setData] = useState();


    const onClickButton = () => {
        $('#summernote').summernote('focus');
        setData($('#summernote').summernote('code'));

    }

    const sendFile = (file, editor) => {
        var data = new FormData();
        data.append("file", file);
        // front backend 동일 서버에서 사용.
        const host = "https://" + window.location.hostname + ':' + process.env.NEXT_PUBLIC_BACKEND_PORT;

        const result = noteApi.saveImage(data).then(
            (res) => {
                console.log(host + '/files/' + res.data + '');
                $(editor).summernote('insertImage', host + '/files/' + res.data + ' ');
            }
        );
    };



    useEffect(() => {
        if (mode === "READ") {
            $('#summernote').summernote({
                height: 500,
                toolbar: [],
                disableDragAndDrop: true,
            });
            $('#summernote').summernote('disable');
        }
        else {
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
                        const that = $(this);
                        sendFile(files[0], that);
                    }
                },
            });
        }

        if(NoteInfo.content){
            $('#summernote').summernote("insertText", NoteInfo.content);    
        }

    }, []);

    return (
        <Container mode={mode}>
            {(mode === "READ") && (
                <></>
            )}
            {(mode !== "READ") && (
                <div className="title_input">
                    <Input
                        type="text"
                        placeholder="제목"
                        color="gray_cd"
                        focusColor="gray_80"
                        useValidation={false}
                    />
                </div>
            )}
            <Container id="summernote" />
            <button onClick={onClickButton}>Button</button>
            {JSON.stringify(data)}
        </Container>
    )
};

export default Editor;