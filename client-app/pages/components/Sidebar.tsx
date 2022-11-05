import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import noteApi from "../../api/note";
import userApi from "../../api/user";
import useModal from "../../hooks/useModal";
import { useSelector } from "../../store";
import { authAction } from "../../store/auth";
import { commonAction } from "../../store/common";
import { userActions } from "../../store/user";
import AuthModal from "./authModal/AuthModal";
import Button from "./common/Button";
import Input from "./common/Input";
import Router from "next/router";
import palette from "../../styles/palette";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

interface StyledProps {
  istoggle: boolean;
  isDark: boolean;
}

const Container = styled.div<StyledProps>`
  ${(props) =>
    props.isDark &&
    css`
      background-color: ${palette.dark_15} !important;
      a,
      li {
        color: ${palette.gray_c4};
      }
      .visit--count ul li:first-child {
        color: ${palette.gray_c4} !important;
      }
      .category .count {
        color: ${palette.red_57};
      }
      .darkModeIcon {
        background-color: ${palette.dark_15} !important;
      }

      .userInfo {
        color: ${palette.gray_c4} !important;
      }
    `}

  ${(props) =>
    !props.istoggle &&
    css`
      visibility: hidden;
      width: 0px;
      left: -500px;
      transition: all 0.5s;
    `}
  
    ${(props) =>
    props.istoggle &&
    css`
      visibility: visible;
      width: 330px;
      left: 0px;
      transition: all 0.5s;
    `}

  width: 330px;
  height: 100%;
  overflow-y: auto;

  border: 1px solid #eee;
  position: fixed;
  z-index: 1;
  background: #fff;

  @media only screen and (max-width: 768px) {
    width: 100%;
    max-width: 600px;
    height: 100%;
    overflow-y: auto;
    border: 1px solid #eee;
    position: fixed;
    z-index: 1;
    background: #fff;
  }

  .inner {
    margin-left: 28px;
    margin-right: 28px;

    @media only screen and (max-width: 768px) {
      margin-left: 20px;
      margin-right: 20px;
    }
  }

  .toggle-btn {
    background: url("../img/toggle_blue.svg");
    width: 28px !important;
    height: 18px;
    cursor: pointer;
    margin: 27px 0;
  }

  .userInfo {
    border: 1px solid ${palette.green_53};
    border-radius: 50px;
    padding: 0 10px;
    width: auto;
    height: 24px;

    align-items: center;
    margin-left: 10px;

    color: ${palette.black};
    font-size: 16px;
    font-weight: 600;
    display: none;

    @media only screen and (max-width: 768px) {
      position: absolute;
      top: 28px;
      right: 10px;
      display: block;
    }
  }

  #search-form {
    margin-top: 33px;
    display: flex;
    position: relative;

    @media only screen and (max-width: 768px) {
      width: 100%;
      max-width: 600px;
    }
  }

  #search {
    width: 280px;

    @media only screen and (max-width: 768px) {
      width: 100% !important;
    }
  }

  .search-submit {
    background: url("../img/search.png");
    position: absolute;
    top: 2px;
    right: 5px;
    width: 32px;
    height: 32px;
    text-indent: -9999px;
    border: none;
    cursor: pointer;
  }

  .btn-group {
    display: none;

    @media only screen and (max-width: 768px) {
      margin-top: 15px;
      display: flex;
      max-width: 600px;
      justify-content: left;
    }
  }

  .visit--count {
    margin-top: 28px;
    margin-bottom: 20px;
  }
  .visit--count ul {
    display: flex;
    margin-bottom: 8px;
  }
  .visit--count ul li:first-child {
    font-weight: bold;
    font-size: 12px;
    line-height: 15px;
    color: black;
    margin-right: 8px;
  }
  .visit--count ul li {
    font-weight: normal;
    font-size: 12px;
    line-height: 15px;
    color: ${palette.green_53};
  }

  .category {
    margin: 8px 0;
    border-top: 1px solid ${palette.green_53};
  }
  .category .menu {
    margin-top: 24px;
    margin-bottom: 12px;
    font-weight: bold;
    font-size: 24px;
    line-height: 29px;
    color: black;
    display: flex;
  }
  .category .menu .count {
    font-size: 12px;
    line-height: 29px;
    color: ${palette.red_57};
    margin-left: 8px;
  }
  .category .sub--menu {
    margin-bottom: 4px;
    font-size: 20px;
    line-height: 29px;
    color: black;
    display: flex;
  }
  .category .sub--menu .count {
    font-size: 12px;
    line-height: 29px;
    color: ${palette.red_57};
    margin-left: 4px;
  }

  .darkModeIcon {
    margin-top: 4px;
    border: none;
    background-color: white;
  }

  /* FLOAT CLEARFIX */
  .clearfix::after {
    content: "";
    clear: both;
    display: block;
  }
  .float--left {
    float: left;
  }
  .float--right {
    float: right;
  }
`;

const Sidebar = () => {
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [categoryMap, setCategoryMap] = useState<Map<string, number>>();
  const [subCategoryMap, setSubCategoryMap] =
    useState<Map<string, Map<string, number>[]>>();
  const [search, setSearch] = useState("");

  const [todayCount, setTodayCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const dispatch = useDispatch();
  const isToggle = useSelector((state) => state.common.toggle);
  const userInfo = useSelector((state) => state.user);
  const isDarkMode = useSelector((state) => state.common.isDark);
  const iconColor = isDarkMode === true ? "yellow" : "ff9500";
  const { openModal, ModalPortal, closeModal } = useModal();

  const changeToggle = () => {
    dispatch(commonAction.setToggleMode(!isToggle));
  };

  const changeDarkMode = () => {
    dispatch(commonAction.setDarkMode(!isDarkMode));
  };

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const getCategoryList = async () => {
    const { data } = await noteApi.getSidebarCategoryList();
    const categoryList: string[] = [];
    const category = new Map<string, number>();
    const dictionary = new Map<string, Map<string, number>[]>();

    data.map((t) => {
      const subCategoryArr = Array<Map<string, number>>();
      const subCategory = new Map<string, number>();
      // key set
      if (!category.has(t.name)) {
        categoryList.push(t.name);
        category.set(t.name, t.mainCount);
        subCategory.set(t.subName, t.subCount);
        subCategoryArr.push(subCategory);
        dictionary.set(t.name, subCategoryArr);
      }
      // value set
      else {
        subCategory.set(t.subName, t.subCount);
        const buff = dictionary.get(t.name);
        if (!!buff) {
          buff?.push(subCategory);
          dictionary.set(t.name, buff);
        }
      }
    });

    setCategoryList(categoryList);
    setCategoryMap(category);
    setSubCategoryMap(dictionary);
  };

  // search button filter
  const searchButtonFilter = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    dispatch(commonAction.setSearchFilter(search));
    setSearch("");
  };

  // category filter
  const categoryFilter = (category: string, subCategory: string) => {
    dispatch(commonAction.setCategoryFilter(category));
    dispatch(commonAction.setSubCategoryFilter(subCategory));
    dispatch(commonAction.setSearchFilter(""));
  };

  const onClickLogin = () => {
    dispatch(authAction.setAuthMode("login"));
    openModal();
    dispatch(commonAction.setToggleMode(false));
  };

  const onClickRegister = () => {
    dispatch(authAction.setAuthMode("signup"));
    openModal();
    dispatch(commonAction.setToggleMode(false));
  };

  const onClickLogout = () => {
    try {
      userApi.Logout();
      dispatch(userActions.initUser());
      Router.push("../");
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const onClickLogHistory = () => {
    if (userInfo.role === "ADMIN") {
      Router.push("/map/LogHistory");
    }
  };

  useEffect(() => {
    getCategoryList();

    noteApi.getTotalReadCount().then((res) => {
      setTotalCount(res.data);
    });

    noteApi.getTodayReadCount().then((res) => {
      setTodayCount(res.data);
    });
  }, []);

  return (
    <Container istoggle={isToggle} isDark={isDarkMode}>
      <div className="inner">
        <div className="toggle-btn" onClick={changeToggle}>
          {userInfo.isLogged && (
            <div className="userInfo" onClick={onClickLogHistory}>
              {userInfo.name}
            </div>
          )}
        </div>
        <form id="search-form" method="post" action="#">
          <Input
            type="text"
            id="search"
            placeholder="Search"
            useValidation={false}
            value={search}
            onChange={onChangeSearch}
          />
          <button className="search-submit" onClick={searchButtonFilter} />
        </form>
        <div className="btn-group toggle">
          {userInfo.isLogged && <Button onClick={onClickLogout}>Logout</Button>}
          {!userInfo.isLogged && (
            <>
              <Button onClick={onClickLogin}>Login</Button>
              <Button onClick={onClickRegister}>Register</Button>
            </>
          )}
        </div>
        <div className="visit--count clearfix">
          <div className="float--left">
            <ul>
              <li>Total visit</li>
              <li>{totalCount}</li>
            </ul>
            <ul>
              <li>Today visit</li>
              <li>{todayCount}</li>
            </ul>
          </div>
          <div className="float--right">
            {isDarkMode && (
              <button className="darkModeIcon" onClick={changeDarkMode}>
                <FontAwesomeIcon
                  icon={faMoon}
                  style={{ fontSize: 25, color: iconColor }}
                />
              </button>
            )}
            {!isDarkMode && (
              <button className="darkModeIcon" onClick={changeDarkMode}>
                <FontAwesomeIcon
                  icon={faSun}
                  style={{ fontSize: 25, color: iconColor }}
                />
              </button>
            )}
          </div>
        </div>
        {categoryList.map((category, index) => (
          <div className="category" key={index}>
            <ul className="menu">
              <li>
                <div onClick={() => categoryFilter(category, "")}>
                  <a href="#">{category}</a>
                </div>
              </li>
              <li className="count">
                ({categoryMap && categoryMap.get(category)})
              </li>
            </ul>
            {subCategoryMap?.get(category)?.map(function (option, i) {
              return (
                <>
                  <ul className="sub--menu" key={i}>
                    <li>
                      <div
                        onClick={() =>
                          categoryFilter(
                            category,
                            option.entries().next().value[0]
                          )
                        }
                      >
                        <a href="#">{option.entries().next().value[0]}</a>
                      </div>
                    </li>
                    {option.entries().next().value[0] && (
                      <li className="count">
                        ({option.entries().next().value[1]})
                      </li>
                    )}
                  </ul>
                </>
              );
            })}
          </div>
        ))}
        <ModalPortal>
          <AuthModal closeModal={closeModal} />
        </ModalPortal>
      </div>
    </Container>
  );
};

export default Sidebar;
