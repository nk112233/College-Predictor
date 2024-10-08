import React, { useState, useEffect, useRef } from "react";
import { Dropdown } from "flowbite-react";
import axios from "axios";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import Legends from "../components/Legends";
const CollegePredictor = () => {
  const url = import.meta.env.VITE_BASE_URL;
  const [inp, setInp] = useState("Percentile");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isClgOpen, setIsClgOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [branch, setBranch] = useState([]);
  const [type, setType] = useState([]);
  const [city, setCity] = useState([]);
  const [clg, setClg] = useState([]);
  const [round, setRound] = useState(4);

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [selectedClg, setSelectedClg] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [table, setTable] = useState([]);
  const [rank, setRank] = useState("");

  const categoryRef = useRef(null);
  const branchRef = useRef(null);
  const typeRef = useRef(null);
  const cityRef = useRef(null);
  const clgRef = useRef(null);

  const handleClickOutside = (event) => {
    let shouldClearSearchText = false;
  
    // Check if click was outside of each dropdown
    console.log( "w ", isCategoryOpen);
    if (categoryRef.current && !categoryRef.current.contains(event.target) && isCategoryOpen) {
      setIsCategoryOpen(false);
      shouldClearSearchText = true;
      console.log("Category clicked outside");
    }
    if (branchRef.current && !branchRef.current.contains(event.target) && isBranchOpen) {
      setIsBranchOpen(false);
      shouldClearSearchText = true;
      console.log("Branch clicked outside");
    }
    if (typeRef.current && !typeRef.current.contains(event.target) && isTypeOpen) {
      setIsTypeOpen(false);
      shouldClearSearchText = true;
      console.log("Type clicked outside");
    }
    if (cityRef.current && !cityRef.current.contains(event.target) && isCityOpen) {
      setIsCityOpen(false);
      shouldClearSearchText = true;
      console.log("City clicked outside");
    }
    if (clgRef.current && !clgRef.current.contains(event.target) && isClgOpen) {
      setIsClgOpen(false);
      shouldClearSearchText = true;
      console.log("Clg clicked outside");
    }
  
    // Clear search text if any dropdown was clicked outside
    if (shouldClearSearchText) {
      setSearchText("");
      console.log("Cleared search text");
    }
  };
  
  const handleSelect = (setter, value, isSelected) => {
    setter((prev) =>
      isSelected ? [...prev, value] : prev.filter((item) => item !== value)
    );
    
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCategoryOpen , isBranchOpen , isCityOpen , isTypeOpen , isClgOpen]);

  useEffect(() => {
    const loadingToastId = toast.loading("Loading Site Please Wait...");
    axios
      .get(`${url}/api?round=4`)
      .then((res) => {
        setCategory(res.data.data.category);
        setBranch(res.data.data.branch);
        setType(res.data.data.status);
        setTable(res.data.data.tableData);
        setCity(res.data.data.city);
        setClg(res.data.data.clgname);
        toast.dismiss(loadingToastId);
      })
      .catch((error) => {
        console.log(error.message);
        toast.error(error.message);
      });
  }, []);

  const dis = false;
  const getColleges = (e) => {
    e.preventDefault();

    if (!rank) {
      console.log("Rank or Percentile Required!");
      toast.error("Rank or Percentile Required!");
      return;
    }
    let data;
    console.log("rk", rank);
    if (inp === "Percentile") {
      if(rank<0 || rank>100){
        toast.error("Invalid Percentile!");
        return;
      }
      data = { percentile: rank };
    } else {
      if(rank<0){
        toast.error("Invalid Rank!");
        return;
      }
      data = { rank: rank };
    }
    const ctg = selectedCategory.join(",");
    const brn = selectedBranch.join(",");
    const typ = selectedType.join(",");
    const cit = selectedCity.join(",");
    const loadingToastId = toast.loading("Fetching  Data...");
    axios
      .post(
        `${url}/api/getclgs?category=${ctg}&branch=${brn}&status=${selectedType}&city=${selectedCity}&clg=${selectedClg}&round=${round}`,
        data
      )
      .then((res) => {
        console.log(res.data);
        setTable(res.data.data);
        toast.dismiss(loadingToastId);
        const tableElement = document.getElementById("clg-table"); // Replace with your actual table id or ref
        if (tableElement) {
          tableElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        toast.success("Colleges Fetched Successfully");
      })
      .catch((error) => {
        console.log(error.message);
        toast.error(error.message);
      });
  };

  const handleCategorySelect = (item) => {
    setSelectedCategory(item);
    setIsCategoryOpen(false);
    
  };

  const handleBranchSelect = (item) => {
    setSelectedBranch(item);
    setIsBranchOpen(false);

  };

  const handleTypeSelect = (item) => {
    setSelectedType(item);
    setIsTypeOpen(false);

  };
  const handleCitySelect = (item) => {
    setSelectedCity(item);
    setIsCityOpen(false);
    
  };
  const handleClgSelect = (item) => {
    setSelectedClg(item);
    setIsClgOpen(false);
    setSearchText(""); // Reset search text
    
  };

  const handleSearchInputChange = (event) => {
    setSearchText(event.target.value);
  };
  const handleRankInputChange = (event) => {
    setRank(event.target.value);
    const inputValue = event.target.value;

    // If input exceeds 8 characters, show an error message
    if (inputValue.length > 7) {
      toast.error("Character Limit Exceeded!");
    }
  };

  const filteredCategories = category.filter((item) =>
    item.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredBranches = branch.filter((item) =>
    item.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredTypes = type.filter((item) =>
    item.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredCity = city.filter((item) =>
    item.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredClg = clg.filter((item) =>
    item.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortAndFilterItems = (items, selectedItems) => {
    return items
      .filter((item) => item.toLowerCase().includes(searchText.toLowerCase()))
      .sort((a, b) => {
        const aSelected = selectedItems.includes(a);
        const bSelected = selectedItems.includes(b);
        if (aSelected && !bSelected) return -1;
        if (!aSelected && bSelected) return 1;
        return a.localeCompare(b);
      });
  };

  const sortedCategories = sortAndFilterItems(category, selectedCategory);
  const sortedBranches = sortAndFilterItems(branch, selectedBranch);
  const sortedTypes = sortAndFilterItems(type, selectedType);
  const sortedCities = sortAndFilterItems(city, selectedCity);
  const sortedColleges = sortAndFilterItems(clg, selectedClg);

  const handleReset = (setter) => {
    setter([]);
  };

  const handleRound = (num) => {

  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex sm:flex-row flex-col my-10 px-8 justify-between">
          <div className="flex justify-center w-full mx-auto sm:mx-10">
            <div className="w-20 h-fit self-center mx-4 dark:text-white text-gray-900">
              <Dropdown label={<span className="dark:text-white text-gray-900">{inp}</span>}>
                <Dropdown.Item onClick={() => setInp("Percentile")}>
                  <div className="text-md font-medium text-gray-900 dark:text-white">
                  Percentile
                  </div>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setInp("Rank")}>
                <div className="text-md font-medium text-gray-900 dark:text-white">
                  Rank
                  </div>
                </Dropdown.Item>
              </Dropdown>
            </div>
            <div className="mb-6 p-10 gap-x-10 w-full">
              <label
                htmlFor="default-input"
                className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
              >
                Your {inp}
              </label>
              <input
                type="text"
                id="default-input"
                value={rank}
                onChange={handleRankInputChange}
                maxlength="8"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex mb-6 w-full relative mx-auto sm:mx-10">
            <div className="w-full self-center" id="category" ref={categoryRef}>
              <label
                htmlFor="dropdown-button"
                className="inline-flex mb-2 text-md font-medium text-gray-900 dark:text-white"
              >
                Your Category
              </label>
              <button
                id="dropdown-button"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex relative w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-blue-500 justify-between"
              >
                <span className="mr-2 text-gray-700 dark:text-gray-200">
                  {selectedCategory.join(", ")}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 ml-2 -mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isCategoryOpen && (
                <div
                  id="dropdown-menu"
                  className="absolute left-0 w-full rounded-md shadow-lg dark:bg-gray-700 bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1 overflow-y-scroll h-60 z-40"
                >
                  <button
                    className="block px-2 py-2 text-sm border border-slate-300 dark:text-gray-200 dark:hover:bg-gray-800 dark:border-gray-600 cursor-pointer rounded-md"
                    onClick={() => handleReset(setSelectedCategory)}
                  >
                    Reset
                  </button>
                  <input
                    id="search-input"
                    className="block w-full px-2 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border rounded-md border-gray-300 focus:outline-none h-8"
                    type="text"
                    placeholder="Search items"
                    autoComplete="off"
                    value={searchText}
                    onChange={handleSearchInputChange}
                  />
                  <div className="block px-4 py-2 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer rounded-md">
                    <input
                      disabled={true}
                      type="checkbox"
                      checked={selectedCategory.length === 0}
                      onChange={(e) =>
                        handleSelect(setSelectedCategory, "", e.target.checked)
                      }
                    />
                    &nbsp;&nbsp;All
                  </div>
                  {sortedCategories.map((item, index) => (
                    <div
                      key={index}
                      className="block px-4 py-2 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer rounded-md"
                      onClick={() =>
                        handleSelect(
                          setSelectedCategory,
                          item,
                          !selectedCategory.includes(item)
                        )
                      }
                    >
                      <input
                        type="checkbox"
                        className={`${
                          !selectedCategory.includes(item) ? "hidden" : ""
                        }`}
                        checked={selectedCategory.includes(item)}
                        onChange={() =>
                          handleSelect(
                            setSelectedCategory,
                            item,
                            !selectedCategory.includes(item)
                          )
                        }
                      />
                      &nbsp;&nbsp;{item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex sm:flex-row flex-col my-10 px-10 justify-between">
          <div className="flex mb-6 w-full relative mx-auto sm:mx-10">
            <div className="w-full self-center" id="branch" ref={branchRef}>
              <label
                htmlFor="dropdown-button"
                className="inline-flex mb-2 text-md font-medium text-gray-900 dark:text-white"
              >
                Branch
              </label>
              <button
                id="dropdown-button"
                onClick={() => setIsBranchOpen(!isBranchOpen)}
                placeholder="Branch"
                className="flex relative w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-blue-500 justify-between"
              >
                <span className="mr-2 text-gray-700 dark:text-gray-200">
                  {selectedBranch.join(", ")}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 ml-2 -mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isBranchOpen && (
                <div
                  id="dropdown-menu"
                  className="absolute left-0 w-full rounded-md shadow-lg dark:bg-gray-700 bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1 overflow-y-scroll h-60 z-40"
                >
                  <button
                    className="block px-2 py-2 text-sm border border-slate-300 dark:text-gray-200 dark:hover:bg-gray-800 dark:border-gray-600 cursor-pointer rounded-md"
                    onClick={() => handleReset(setSelectedBranch)}
                  >
                    Reset
                  </button>
                  <input
                    id="search-input"
                    className="block w-full px-2 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border rounded-md border-gray-300 focus:outline-none h-8"
                    type="text"
                    placeholder="Search items"
                    autoComplete="off"
                    value={searchText}
                    onChange={handleSearchInputChange}
                  />
                  <div className="block px-4 py-2 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer rounded-md">
                    <input
                      disabled={true}
                      type="checkbox"
                      checked={selectedBranch.length === 0}
                      onChange={(e) =>
                        handleSelect(setSelectedBranch, "", e.target.checked)
                      }
                    />
                    &nbsp;&nbsp;All
                  </div>
                  {sortedBranches.map((item, index) => (
                    <div
                      key={index}
                      className="block px-4 py-2 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer rounded-md"
                      onClick={() =>
                        handleSelect(
                          setSelectedBranch,
                          item,
                          !selectedBranch.includes(item)
                        )
                      }
                    >
                      <input
                        type="checkbox"
                        className={`${
                          !selectedBranch.includes(item) ? "hidden" : ""
                        }`}
                        checked={selectedBranch.includes(item)}
                        onChange={() =>
                          handleSelect(
                            setSelectedBranch,
                            item,
                            !selectedBranch.includes(item)
                          )
                        }
                      />
                      &nbsp;&nbsp;{item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex mb-6 w-full relative  mx-auto sm:mx-10">
            <div className="w-full self-center" id="type" ref={typeRef}>
              <label
                htmlFor="dropdown-button"
                className="inline-flex mb-2 text-md font-medium text-gray-900 dark:text-white"
              >
                Type
              </label>
              <button
                id="dropdown-button"
                onClick={() => setIsTypeOpen(!isTypeOpen)}
                className="flex relative w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-blue-500 justify-between"
              >
                <span className="mr-2 text-gray-700 dark:text-gray-200">
                  {selectedType.join(", ")}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 ml-2 -mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isTypeOpen && (
                <div
                  id="dropdown-menu"
                  className="absolute left-0 w-full rounded-md shadow-lg dark:bg-gray-700 bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1 overflow-y-scroll h-60 z-40"
                >
                  <button
                    className="block px-2 py-2 text-sm border border-slate-300 dark:text-gray-200 dark:hover:bg-gray-800 dark:border-gray-600 cursor-pointer rounded-md"
                    onClick={() => handleReset(setSelectedType)}
                  >
                    Reset
                  </button>
                  <input
                    id="search-input"
                    className="block w-full px-2 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border rounded-md border-gray-300 focus:outline-none h-8"
                    type="text"
                    placeholder="Search items"
                    autoComplete="off"
                    value={searchText}
                    onChange={handleSearchInputChange}
                  />
                  <div className="block px-4 py-2 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer rounded-md">
                    <input
                      disabled={true}
                      type="checkbox"
                      checked={selectedType.length === 0}
                      onChange={(e) =>
                        handleSelect(setSelectedType, "", e.target.checked)
                      }
                    />
                    &nbsp;&nbsp;All
                  </div>
                  {sortedTypes.map((item, index) => (
                    <div
                      key={index}
                      className="block px-4 py-2 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer rounded-md"
                      onClick={() =>
                        handleSelect(
                          setSelectedType,
                          item,
                          !selectedType.includes(item)
                        )
                      }
                    >
                      <input
                        type="checkbox"
                        className={`${
                          !selectedType.includes(item) ? "hidden" : ""
                        }`}
                        checked={selectedType.includes(item)}
                        onChange={() =>
                          handleSelect(
                            setSelectedType,
                            item,
                            !selectedType.includes(item)
                          )
                        }
                      />
                      &nbsp;&nbsp;{item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* third row */}
        <div className="flex flex-col sm:flex-row my-10 px-10 justify-between sm:mt-20">
          <div
            className="mb-6 w-full self-center mx-auto sm:mx-10 relative"
            id="type"
            ref={cityRef}
          >
            <label
              htmlFor="dropdown-button"
              className="inline-flex mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              City
            </label>
            <button
              id="dropdown-button"
              onClick={() => setIsCityOpen(!isCityOpen)}
              className="flex relative w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-blue-500 justify-between"
            >
              <span className="mr-2 text-gray-700 dark:text-gray-200">
                {selectedCity.join(", ")}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 ml-2 -mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {isCityOpen && (
              <div
                id="dropdown-menu"
                className="absolute left-0 w-full rounded-md shadow-lg dark:bg-gray-700 bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1 overflow-y-scroll h-60 z-40"
              >
                <button
                  className="block px-2 py-2 text-sm border border-slate-300 dark:text-gray-200 dark:hover:bg-gray-800 dark:border-gray-600 cursor-pointer rounded-md"
                  onClick={() => handleReset(setSelectedCity)}
                >
                  Reset
                </button>
                <input
                  id="search-input"
                  className="block w-full px-2 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border rounded-md border-gray-300 focus:outline-none h-8"
                  type="text"
                  placeholder="Search items"
                  autoComplete="off"
                  value={searchText}
                  onChange={handleSearchInputChange}
                />
                <div className="block px-4 py-2 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer rounded-md">
                  <input
                    disabled={true}
                    type="checkbox"
                    checked={selectedCity.length === 0}
                    onChange={(e) =>
                      handleSelect(setSelectedCity, "", e.target.checked)
                    }
                  />
                  &nbsp;&nbsp;All
                </div>
                {sortedCities.map((item, index) => (
                  <div
                    key={index}
                    className="block px-4 py-2 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer rounded-md"
                    onClick={() =>
                      handleSelect(setSelectedCity, item, !selectedCity.includes(item))
                    }
                  >
                    <input
                      type="checkbox"
                      className={`${
                        !selectedCity.includes(item) ? "hidden" : ""
                      }`}
                      checked={selectedCity.includes(item)}
                      onChange={() =>
                        handleSelect(setSelectedCity, item, !selectedCity.includes(item))
                      }
                    />
                    &nbsp;&nbsp;{item}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            className="mb-6 w-full self-center relative mx-auto sm:mx-10"
            id="type"
            ref={clgRef}
          >
            <label
              htmlFor="dropdown-button"
              className="inline-flex mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              College Name
            </label>
            <button
              id="dropdown-button"
              onClick={() => setIsClgOpen(!isClgOpen)}
              className="flex relative w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-blue-500 justify-between"
            >
              <span className="mr-2 text-gray-700 dark:text-gray-200">
                {selectedClg}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 ml-2 -mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {isClgOpen && (
              <div
                id="dropdown-menu"
                className="absolute left-0 w-full rounded-md shadow-lg dark:bg-gray-700 bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1 overflow-y-scroll h-60"
              >
                <input
                  id="search-input"
                  className="block w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border rounded-md border-gray-300 focus:outline-none"
                  type="text"
                  placeholder="Search items"
                  autoComplete="off"
                  value={searchText}
                  onChange={handleSearchInputChange}
                />
                <a
                  href="#"
                  onClick={() => handleClgSelect("")}
                  className="block px-4 py-2 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer rounded-md"
                >
                  No choice
                </a>
                {filteredClg.map((item, index) => (
                  <a
                    key={index}
                    onClick={() => handleClgSelect(item)}
                    className="block px-4 py-2 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer rounded-md"
                  >
                    &nbsp;&nbsp;{item}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <label
        htmlFor="round"
        className="inline-flex mb-2 font-medium text-gray-900 dark:text-white mx-20 my-4 text-md"
      >
        Cap Rounds
      </label>
      <div
        className="flex sm:mx-20 mx-auto justify-center sm:justify-start"
        id="round"
      >
        <div className="flex items-center me-4">
          <input
            id="inline-radio"
            type="radio"
            value={1}
            name="inline-radio-group"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            onClick={() => setRound(1)}
          />
          <label
            htmlFor="inline-radio"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Round 1
          </label>
        </div>
        <div className="flex items-center me-4">
          <input
            id="inline-2-radio"
            type="radio"
            value={2}
            name="inline-radio-group"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            onClick={() => setRound(2)}
          />
          <label
            htmlFor="inline-2-radio"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Round 2
          </label>
        </div>
        <div className="flex items-center me-4">
          <input
            id="inline-3-radio"
            type="radio"
            value={3}
            name="inline-radio-group"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            onClick={() => setRound(3)}
          />
          <label
            htmlFor="inline-3-radio"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Round 3
          </label>
        </div>
        <div className="flex items-center me-4">
          <input
            id="inline-3-radio"
            type="radio"
            value={4}
            name="inline-radio-group"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            defaultChecked
            onClick={() => setRound(4)}
          />
          <label
            htmlFor="inline-3-radio"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            2024 CAP Round 3
          </label>
        </div>
      </div>
      <div className="flex sm:mx-20 mx-auto justify-center sm:justify-start my-4">
        <Legends/>
        </div> 
      <div className="flex justify-center my-4">
        <button
          type="button"
          onClick={getColleges}
          disabled={dis}
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-ubuntu rounded-lg px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 font-extrabold sm:h-16 sm:text-xl text-md"
        >
          Predict Colleges!
        </button>
      </div>
      <div className="p-6 w-full font-ubuntu font-bold ">
        <p className="font-bold dark:text-purple-300 py-2 text-purple-800 text-sm md:text-lg">The Data is Taken From  State Common Entrance Test Cell, Government of Maharashtra, India.</p>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table
            className="w-full text-sm text-left rtl:text-right text-gray-200 dark:text-gray-200"
            id="clg-table"
          >
            <thead className="text-md text-gray-700  uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  College Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Branch
                </th>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>
                <th scope="col" className="px-6 py-3">
                  Percentile
                </th>
                <th scope="col" className="px-6 py-3">
                  Rank
                </th>
                <th scope="col" className="px-6 py-3">
                  City
                </th>
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              {table.map((item, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-3xl text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.name}
                  </th>
                  <td className="px-6 py-4 text-yellow-400">{item.branch}</td>
                  <td className="px-6 py-4 dark:text-yellow-100 text-red-800 ">{item.category}</td>
                  <td className="px-6 py-4 text-orange-400">{item.percentile}</td>
                  <td className="px-6 py-4 text-cyan-400">{item.rank}</td>
                  <td className="px-6 py-4 text-purple-400">{item.city}</td>
                  <td className="px-6 py-4 text-green-400">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
  
};

export default CollegePredictor;
