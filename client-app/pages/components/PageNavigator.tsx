import { css, styled } from "styled-components";
import palette from "../../styles/palette";
import { useSelector } from "../../store";
import { useEffect, useState } from "react";
import noteApi, { NoteSummary } from "../../api/note";

interface StyledProps {
  $isdark: boolean;
}

const Container = styled.div<StyledProps>`
  ${(props) =>
    props.$isdark &&
    css`
      background-color: ${palette.dark_15} !important;
      .home-button {
        background-color: ${palette.dark_15} !important;
      }
      a {
        color: ${palette.gray_c4} !important;
      }
    `}

  .page-navigation {
    display: flex;
    justify-content: space-between;
    padding-top: 50px;
    padding-bottom: 50px;
    gap: 20px; /* Add a gap between the navigation items */

    ${(props) => 
        props.$isdark && 
        css`
        background-color: ${palette.dark_19} !important;
        `
    }
  }

  .nav-item {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    background-color: ${props => props.$isdark ? palette.dark_2F : palette.gray_f7} !important;
    border-bottom: 2px solid ${palette.green_53};
    border-radius: 5px !important;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1) !important;
    flex: 1; /* Allow the nav items to grow and fill the available space equally */
    max-width: 40%; 

    &:hover {
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15) !important;
      background-color: ${props => props.$isdark ? palette.gray_71 : palette.gray_f7} !important;

      .text .title {
        background-color: ${props => props.$isdark ? palette.gray_71 : palette.gray_f7} !important;
      }
    }

    svg {
      fill: #34c759 !important;
      width: 24px !important;
      height: 24px !important;
      margin-right: 10px !important;
    }

    .text {
      display: flex;
      flex-direction: column;
    }

    .text span {
      color: #888 !important;
      font-size: 14px !important;
    }

    .text .title {
      font-size: 18px !important;
      font-weight: bold !important;
      color: ${props => props.$isdark ? palette.gray_e5 : '#333'} !important;
      background-color: ${props => props.$isdark ? palette.dark_2F : palette.gray_f7} !important;
      border: none;
    }
  }

  .nav-item.next {
    justify-content: flex-end !important;
    text-align: right; /* Align text to the right */

    svg {
      margin-left: 20px !important;
      margin-right: 0 !important;
    }
  }
`;

interface IProps {
    noteId: number;
  }

  const PageNavigator: React.FC<IProps> = ({ noteId }) => {
    const isDarkMode = useSelector((state) => state.common.isDark);
    const [prevNote, setPrevNote] = useState<NoteSummary>();
    const [nextNote, setNextNote] = useState<NoteSummary>();
  
    useEffect(() => {
      const fetchSummary = async () => {
        try {
          const response = await noteApi.getNoteSummary();

          if(response.data){
            const currentIndex = response.data.findIndex(
              (note) => note.noteId == noteId
            );

            if (currentIndex !== -1){
              setPrevNote(response.data[currentIndex -1] || null);
              setNextNote(response.data[currentIndex +1] || null);
            }
          }
        } catch (error) {
          console.error("Failed to fetch note summaries", error);
        }
      };
  
      fetchSummary();
    }, [noteId]);

    const PageNavigate = (id : number) =>{
      window.location.href = `/blog/${id}`;
    }

  return (
    <>
      <Container $isdark={isDarkMode}>
        <div className="page-navigation">
          {prevNote!!! && (
            <div className="nav-item prev" onClick={() => PageNavigate(prevNote.noteId)}>
              <svg viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
              <div className="text">
                <span>이전 포스트 {prevNote?.noteId}</span>
                <div className="title">{prevNote?.title}</div>
              </div>
            </div>
          )}
          {nextNote!!! && (
            <div className="nav-item next" onClick={() => PageNavigate(nextNote.noteId)}>
              <div className="text">
                <span>다음 포스트 {nextNote?.noteId}</span>
                <div className="title">{nextNote?.title}</div>
              </div>
              <svg viewBox="0 0 24 24">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L12.17 12z" />
              </svg>
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default PageNavigator;
