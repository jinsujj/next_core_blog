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
  ${(props) =>
    props.isDark &&
    css`
      .note-editing-area .note-editable {
        background-color: ${palette.dark_19} !important;
      }

      // [ color to dark ]
      color: ${palette.blue_b2} !important;

      a,
      h1,
      h2,
      h3,
      h4 {
        color: ${palette.blue_b2} !important;
      }

      // [ background color to dark ]
      background-color: ${palette.dark_19} !important;

      table tr td b {
        background-color: ${palette.dark_19} !important;
      }

      // [ background highlighter erase ]
      p span {
        background-color: ${palette.dark_19} !important;
      }
      p b {
        background-color: ${palette.dark_19} !important;
      }
      li span {
        background-color: ${palette.dark_19} !important;
      }
      li b {
        background-color: ${palette.dark_19} !important;
      }

      // [ image to dark ]
      img {
        opacity: 0.8 !important;
      }
    `}

  pre {
    color: ${palette.gray_80};
    background-color: (220, 13%, 18%) !important;
  }

  .iframe {
    position: relative;
    width: 100%;
    overflow: hidden;
    padding-top: 56.25%; /* 16:9 Aspect Ratio */
  }
  .note-video-clip {
    position: absolute;
    top: 10;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    border: none;
  }

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
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid ${palette.blockQuote};
  }

  ul li {
    padding: 5px 0px 5px 5px;
    margin-bottom: 5px;
    border-bottom: 1px solid #efefef;
  }

  ol li {
    margin-bottom: 0.5rem;
  }

  .note-editor.note-airframe,
  .note-editor.note-frame {
    ${(props) =>
      props.postState === "read" &&
      css`
        border: 1px solid white !important;
      `}
  }

  .note-editable {
    font-family: "Nanum Gothic", sans-serif;
    min-height: 500px;
    line-height: 1.5;
  }

  .note-statusbar {
    border-top: 0 !important;
    .note-resizebar {
      height: 0px !important;
      .note-icon-bar {
      }
    }
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
      border: 1px solid ${palette.gray_dd};
      color: ${palette.color_99};
    }

    label {
      display: inline-block;
      padding: 10px 20px;
      color: white;
      vertical-align: middle;
      background-color: ${palette.gray_cd};
      cursor: pointer;
      height: 40px;
      margin-left: 10px;
    }

    input[type="file"] {
      position: absolute;
      width: 0;
      height: 0;
      padding: 0;
      overflow: hidden;
      border: 0;
    }
  }
  .float--right {
    float: right;
  }

  .save-button {
    position: relative;
  }

  element.style {
    background-attachment: none !important;
    background-origin: none !important;
    background-clip: unset !important;
  }
`;

const Editor = ({ NoteInfo }) => {
  let host = process.env.NEXT_PUBLIC_API_URL;
  const [imageBuff, setImageBuff] = useState();
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const postState = useSelector((state) => state.common.postState);
  const userId = useSelector((state) => state.user.userId);
  const isDarkMode = useSelector((state) => state.common.isDark);

  const { openModal, ModalPortal, closeModal } = useModal();

  // title
  const onChangeTitle = (event) => {
    setTitle(event.target.value);
  };

  // thumbnail
  const setThumbFile = (event) => {
    const file = event.target.files[0];
    sendFile(file, "thumb");
  };

  // file
  const sendFile = (file, editor) => {
    var data = new FormData();
    data.append("file", file);

    noteApi
      .saveImage(data)
      .then((res) => {
        if (editor === "thumb") setImageBuff(res.data);
        else
          $(editor).summernote(
            "insertImage",
            host + "/files/" + res.data + " "
          );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // open modal
  const openCategoryModal = (event) => {
    event.preventDefault();

    var result = $("#summernote").summernote("code");
    if (XSS_Check(result)) {
      alert("XSS Checked..!!");
      setContent("");
      return;
    }
    setContent($("#summernote").summernote("code"));
    openModal();
  };

  const XSS_Check = (content) => {
    let openTagIndex = -1,
      closeTagIndex = -1;
    let isScriptTagExist = false;

    let arrayValue = Array.from(content);
    arrayValue?.forEach((char, index) => {
      if (char === "<" && openTagIndex === -1) {
        openTagIndex = index;
      } else if (char === ">" && closeTagIndex === -1) {
        closeTagIndex = index;
      }

      if (openTagIndex !== -1 && closeTagIndex !== -1) {
        var buff = content.substring(openTagIndex, closeTagIndex + 1);
        buff.toLowerCase().includes("script")
          ? (isScriptTagExist = true)
          : (isScriptTagExist = false);
        openTagIndex = -1;
        closeTagIndex = -1;

        if (isScriptTagExist) return true;
      }
    });
    return isScriptTagExist;
  };

  // summernote Editor init
  useEffect(() => {
    if (postState === "modify") {
      setTitle(NoteInfo.title);
      $("#summernote").summernote({
        lang: "ko-KR", // default: 'en-US'
        height:
          $(document).height() -
          ($("#Maintable").height() + $("#TblTop").height() + 60),
        tabsize: 3,
        toolbar: toolbar,
        buttons: {
          myVideo: function (context) {
            var ui = $.summernote.ui;
            var button = ui.button({
              contents: '<i class="fa fa-video-camera"/>',
              tooltip: "video",
              click: function () {
                var div = document.createElement("div");
                div.classList.add("iframe");
                var iframe = document.createElement("iframe");
                iframe.src = prompt("Enter video url:");
                iframe.src =
                  " https://www.youtube.com/embed/" + iframe.src.split("=")[1];
                iframe.setAttribute("frameborder", 0);
                iframe.setAttribute("width", "100%");
                iframe.classList.add("note-video-clip");
                iframe.setAttribute("allowfullscreen", true);
                div.appendChild(iframe);
                context.invoke("editor.insertNode", div);
              },
            });

            return button.render();
          },
        },
        focus: true,
        fontNames: [
          "Arial",
          "Courier New",
          "맑은 고딕",
          "굴림체",
          "굴림",
          "돋음체",
          "Montserrat",
          "Nanum Gothic",
          "Nanum Gothic Coding",
          "NanumHimNaeRaNeunMarBoDan",
          "NanumBaReunHiPi",
        ],
        fontNamesIgnoreCheck: [
          "Arial",
          "Courier New",
          "맑은 고딕",
          "굴림체",
          "굴림",
          "돋음체",
          "Montserrat",
          "Nanum Gothic",
          "Nanum Gothic Coding",
          "NanumHimNaeRaNeunMarBoDan",
          "NanumBaReunHiPi",
        ],
        fontSizes: [
          "10",
          "11",
          "12",
          "14",
          "15",
          "16",
          "18",
          "20",
          "22",
          "24",
          "28",
          "30",
          "36",
          "50",
          "72",
        ],
        callbacks: {
          onImageUpload: function (files) {
            const that = $(this);
            sendFile(files[0], that);
          },
        },
      });
      $("#summernote").summernote("reset");
      $("#summernote").summernote("code", NoteInfo.content);
    } else if (postState == "write") {
      $("#summernote").summernote({
        lang: "ko-KR", // default: 'en-US'
        height: 800,
        tabsize: 3,
        toolbar: toolbar,
        buttons: {
          myVideo: function (context) {
            var ui = $.summernote.ui;
            var button = ui.button({
              contents: '<i class="fa fa-video-camera"/>',
              tooltip: "video",
              click: function () {
                var div = document.createElement("div");
                div.classList.add("iframe");
                var iframe = document.createElement("iframe");
                iframe.src = prompt("Enter video url:");
                iframe.src =
                  " https://www.youtube.com/embed/" + iframe.src.split("=")[1];
                iframe.setAttribute("frameborder", 0);
                iframe.setAttribute("width", "100%");
                iframe.classList.add("note-video-clip");
                iframe.setAttribute("allowfullscreen", true);
                div.appendChild(iframe);
                context.invoke("editor.insertNode", div);
              },
            });
            return button.render();
          },
        },
        focus: true,
        fontNames: [
          "Arial",
          "Courier New",
          "맑은 고딕",
          "굴림체",
          "굴림",
          "돋음체",
          "Montserrat",
          "Nanum Gothic",
          "Nanum Gothic Coding",
          "NanumHimNaeRaNeunMarBoDan",
          "NanumBaReunHiPi",
        ],
        fontNamesIgnoreCheck: [
          "Arial",
          "Courier New",
          "맑은 고딕",
          "굴림체",
          "굴림",
          "돋음체",
          "Montserrat",
          "Nanum Gothic",
          "Nanum Gothic Coding",
          "NanumHimNaeRaNeunMarBoDan",
          "NanumBaReunHiPi",
        ],
        fontSizes: [
          "10",
          "11",
          "12",
          "14",
          "15",
          "16",
          "18",
          "20",
          "22",
          "24",
          "28",
          "30",
          "36",
          "50",
          "72",
        ],
        callbacks: {
          onImageUpload: function (files) {
            const that = $(this);
            sendFile(files[0], that);
          },
        },
      });
      $("#summernote").summernote("reset");
      $("#summernote").summernote("focus");
    }
  }, [NoteInfo, postState]);

  return (
    <Container
      onSubmit={openCategoryModal}
      postState={postState}
      isDark={isDarkMode}
    >
      {/* title */}
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
      {/* contnet */}
      <textarea id="summernote" />
      {/* bottom */}
      <div className="save-button clearfix">
        <div className="float--left">
          <input
            className="upload-name"
            value={imageBuff}
            placeholder="Thumbnail"
          />
          <label htmlFor="file">파일찾기</label>
          <input
            type="file"
            id="file"
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

      <ModalPortal>
        <CategoryModal
          postNoteForm={{
            noteId: postState === "modify" ? NoteInfo.noteId : "0",
            title: title,
            userId: userId,
            content: content,
            thumbImage: imageBuff,
            category: postState === "modify" ? NoteInfo.category : "",
            subCategory: postState === "modify" ? NoteInfo.subCategory : "",
          }}
          closeModal={closeModal}
        />
      </ModalPortal>
    </Container>
  );
};

export default Editor;

const toolbar = [
  ["style", ["style"]],
  ["highlight", ["highlight"]],
  ["insert", ["gxcode"]],
  ["fontname", ["fontname"]],
  ["fontsize", ["fontsize"]],
  ["style", ["bold", "italic", "underline", "strikethrough", "clear"]],
  ["color", ["forecolor", "color"]],
  ["table", ["table"]],
  ["para", ["ul", "ol", "paragraph"]],
  ["height", ["height"]],
  ["insert", ["picture", "link"]],
  ["view", ["fullscreen", "codeview"]],
  ["help", ["help"]],
  ["mybutton", ["myVideo"]],
];
