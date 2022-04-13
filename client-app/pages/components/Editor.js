import { stringify } from "querystring";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import noteApi from "../../api/note";
import { useSelector } from "../../store";
import palette from "../../styles/palette";
import Button from "./common/Button";
import Input from "./common/Input";


const Container = styled.form`
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
        ${(props) => props.mode === "READ" && css`
            border: 1px solid white !important;
        `}
    }

    .save-button {
        position: relative;
    }

    .float--left {
        float: left;
    }
    .float--right{
        float: right;
    }
    
`;


const Editor = ({ NoteInfo, mode }) => {
    // front backend 동일 서버에서 사용.
    const host = "https://" + window.location.hostname + ':' + process.env.NEXT_PUBLIC_BACKEND_PORT;

    const [imageBuff, setImageBuff] = useState();
    const [title, setTitle] = useState();
    const postblog = useSelector((state) => state.common.postblog);
    const userId = useSelector((state) => state.user.userId);

    const onChangeTitle = (event) => {
        setTitle(event.target.value);
    }
    
    const setThumbFile = (event) => {
        var data = new FormData();
        const file = event.target.files[0];
        data.append("file", file);
        sendFile(data, "thumb");
    }

    const sendFile = (file, editor) => {
        var data = new FormData();
        data.append("file", file);

        noteApi.saveImage(data).then(
            (res) => {
                if(editor ==="thumb")
                    setImageBuff(res.data)
                else 
                    $(editor).summernote('insertImage', host + '/files/' + res.data + ' ');
            }
        );
    };

    const onSubmitLogin = async (event) => {
        event.preventDefault();

        let content = $('#summernote').summernote('code');
        let image = '';
        if(imageBuff) image = host + '/files/' +  imageBuff ;
        
        var result = noteApi.postNote(0, {
            title: title,
            userId : userId,
            content: content,
            thumbImage: image,
            categoryId: 0,
            password: 0,
        })
        console.log(result);
    }

    useEffect(() => {
        if (mode === "READ") {
            $('#summernote').summernote({
                lang: 'ko-KR', // default: 'en-US'
                height: 800,
                toolbar: [],
                disableDragAndDrop: true,
            });
            $('#summernote').summernote('insertText', NoteInfo.content);
            $('#summernote').summernote('disable');
        }
        else {
            $('#summernote').summernote({
                lang: 'ko-KR', // default: 'en-US'
                height: 500,
                tabsize: 3,
                toolbar: toolbar,
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
            $('#summernote').summernote("reset");
            $('#summernote').summernote('focus');
        }
    }, []);

    return (
        <Container onSubmit={onSubmitLogin}>
            {(mode === "READ") && (
                <></>
            )}
            {(mode === "WRITE") && (
                <div className="title_input">
                    <Input
                        type="text"
                        placeholder="제목"
                        color="gray_cd"
                        focusColor="gray_80"
                        useValidation={false}
                        value={title}
                        onChange={onChangeTitle}
                    />
                </div>
            )}
            <div id="summernote" />
            {postblog && (
                <div className="save-button clearfix">
                    <div className="float--left">
                        <input type="file" onChange={setThumbFile.bind(this)} />
                    </div>
                    <div className="float--right">
                        <Button type="submit">저장하기</Button>
                    </div>
                </div>
            )}
            {JSON.stringify(imageBuff)}
        </Container>
    )
};

export default Editor;


const toolbar = [
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
]