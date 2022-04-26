import { stringify } from "querystring";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import noteApi, { CategoryView, SidebarCategoryView } from "../../api/note";
import { useSelector } from "../../store";
import { commonAction } from "../../store/common";
import Button from "./common/Button";
import Input from "./common/Input";

interface StyledProps {
  istoggle: boolean;
}

const Container = styled.div<StyledProps>`
  width: 330px;
  height: 100%;
  overflow-y: auto;

  border: 1px solid #eee;
  position: fixed;
  z-index: 1;
  background: #fff;

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

    .inner {
    margin-left: 28px;
    margin-right: 28px;
  }

  .toggle-btn {
    background: url("../img/toggle_blue.svg");
    width: 28px !important;
    height: 18px;
    cursor: pointer;
    text-indent: -9999px;
    margin: 27px 0;
  }

  #search-form {
    margin-top: 33px;
    display: flex;
    position: relative;
  }

  #search {
    width: 280px;
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

  .input--text {
    width: 100%;
    height: 40px;
    padding: 2px 10px;
    border: 1px solid #18a0fb;
    border-radius: 4px;
    box-sizing: border-box;
    outline: none;
    font-size: 16px;
    font-weight: 200;
    line-height: 20px;
  }

  .input--text:focus {
    border-color: #51a7e8;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.075),
      0 0 5px rgba(81, 167, 232, 0.5);
  }

  .btn-group {
    display: none;
  }

  .visit--count {
    margin-top: 28px;
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
    color: #219653;
  }

  .category {
    margin: 20px 0;
    border-top: 1px solid #219653;
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
    color: #eb5757;
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
    color: #eb5757;
    margin-left: 4px;
  }
`;


const Sidebar = () => {
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [categoryMap, setCategoryMap] = useState<Map<string, number>>();
  const [subCategoryMap, setSubCategoryMap] =useState<Map<string, Map<string, number>[]>>();

  const [todayCount, setTodayCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] =useState('');
  const isToggle = useSelector((state) => state.common.toggle);
  const dispatch = useDispatch();

  const changeToggle = () => {
    dispatch(commonAction.setToggleMode(!isToggle));
  };

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  }

  const getCategoryList = async () => {
    let { data } = await noteApi.getSidebarCategoryList();
    console.log(data);
    let categoryList: string[] = [];
    let category = new Map<string, number>();
    let dictionary = new Map<string, Map<string, number>[]>();

    data.map((t) => {
      let subCategoryArr = Array<Map<string, number>>();
      let subCategory = new Map<string, number>();
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
        var buff = dictionary.get(t.name);
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

  const onSubmited = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dispatch((commonAction.setSearchFilter(search)));
    setSearch("");
  } 
  
  const categoryFilter = (category:string) => {
    dispatch((commonAction.setCategoryFilter(category)));
  }

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
    <Container istoggle={isToggle} >
      <div className="inner">
        <div className={`toggle-btn`} onClick={changeToggle}>
          Header Menu Button
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
          <button className="search-submit" onClick={onSubmited} />
        </form>
        <div className="btn-group toggle">
          <Button>Login</Button>
          <Button>Register</Button>
        </div>
        <div className="visit--count">
          <ul>
            <li>Total visit</li>
            <li>{totalCount}</li>
          </ul>
          <ul>
            <li>Today visit</li>
            <li>{todayCount}</li>
          </ul>
        </div>
        {categoryList.map((category, index) => (
          <div className="category" key={index}>
            <ul className="menu">
              <li>
                <div onClick={() => categoryFilter(category)}>
                  <a href="#">{category}</a>
                </div>
                
              </li>
              <li className="count">
                ({categoryMap && categoryMap.get(category)})
              </li>
            </ul>
            {/* {subCategoryMap?.get(category)} */}
            {/* {dictionary.get(category) &&
              dictionary.get(category)?.forEach((value, key) => {
                <>
                  <ul className="sub--menu" key={key}>
                    <li>
                      <a href="#">{value.entries().next().value[0]}</a>
                    </li>
                    <li className="count">
                      ({value.entries().next().value[1]})
                    </li>
                  </ul>
                </>;
              })} */}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Sidebar;
