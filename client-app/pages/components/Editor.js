import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import noteApi from "../../api/note";
import useModal from "../../hooks/useModal";
import { useSelector } from "../../store";
import palette from "../../styles/palette";
import CategoryModal from "./categoryModal/CategoryModal";
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
        ${(props) => props.postState === "read" && css`
            border: 1px solid white !important;
        `}
    }

    .save-button {
        position: relative;
    }

    .float--left {
        float: left;

        .upload-name {
            display: inline-block;
            height: 40px;
            padding: 0 10px;
            vertical-align: middle;
            border: 1px solid #dddddd;
            color: #999999;
        }

        label {
            display: inline-block;
            padding: 10px 20px;
            color: white;
            vertical-align: middle;
            background-color: #cdcdcd;
            cursor: pointer;
            height: 40px;
            margin-left:10px;
        }

        input[type="file"]{
            position: absolute;
            width: 0;
            height: 0;
            padding: 0;
            overflow: hidden;
            border:0;
        }
    }
    .float--right{
        float: right;
    }
    
    .save-button {
        position: relative;
    }


`;


const Editor = ({ NoteInfo }) => {
    // front backend 동일 서버에서 사용.
    let host = '';
    const [imageBuff, setImageBuff] = useState();
    const [title, setTitle] = useState();
    const [content, setContent] = useState();
    const postState = useSelector((state) => state.common.postState);
    const userId = useSelector((state) => state.user.userId);

    const { openModal, ModalPortal, closeModal } = useModal();

    // title
    const onChangeTitle = (event) => {
        setTitle(event.target.value);
    }

    // thumbnail
    const setThumbFile = (event) => {
        const file = event.target.files[0];
        sendFile(file, "thumb");
    }

    // file
    const sendFile = (file, editor) => {
        var data = new FormData();
        data.append("file", file);

        noteApi.saveImage(data).then(
            (res) => {
                if (editor === "thumb")
                    setImageBuff(res.data)
                else
                    $(editor).summernote('insertImage', host + '/files/' + res.data + ' ');
            }
        ).catch(
            (err) => {
                console.log(err);
            }
        );
    };

    // open modal
    const openCategoryModal = (event) => {
        event.preventDefault();
        setContent($('#summernote').summernote('code'));
        openModal();
    }


    useEffect(() => {
        host = "https://" + window.location.hostname + ':' + process.env.NEXT_PUBLIC_BACKEND_PORT;

        if (postState === "read") {
            $('#summernote').summernote({
                lang: 'ko-KR', // default: 'en-US'
                height: $(document).height() - ($("#Maintable").height() + $("#TblTop").height() + 60),
                toolbar: [],
                disableDragAndDrop: true,
            });
            $('#summernote').summernote('code', NoteInfo.content);
            $('#summernote').summernote('disable');
        }
        else if (postState === "modify"){
            setTitle(NoteInfo.title);
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
            $('#summernote').summernote('code', NoteInfo.content);
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
        <Container onSubmit={openCategoryModal} postState={postState}>
            {(postState !== "read") && (
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
            {postState !== 'read' && (
                <div className="save-button clearfix">
                    <div className="float--left">
                        <input className="upload-name" value={imageBuff} placeholder="Thumbnail" />
                        <label htmlFor="file">파일찾기</label>
                        <input type="file" id="file"
                            className="upload-name"
                            onChange={setThumbFile.bind(this)}
                            placeholder="첨부파일"
                            accept="image/jpg, image/png, image/jpeg"
                        />
                    </div>
                    <div className="float--right">
                        <Button type="submit">저장하기</Button>
                    </div>
                </div>
            )}
            <ModalPortal>
                <CategoryModal postNoteForm={{
                    noteId : postState === 'modify' ? NoteInfo.noteId : '0',
                    title: title,
                    userId: userId,
                    content: content,
                    thumbImage: imageBuff,
                    category : postState === 'modify' ? NoteInfo.category : '',
                    subCategory: postState === 'modify' ? NoteInfo.subCategory : '',
                }} closeModal={closeModal} />
            </ModalPortal>
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