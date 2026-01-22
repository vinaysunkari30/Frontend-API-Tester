import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import Collections from "../Collections";
import History from "../History";
import JsonView from "@uiw/react-json-view";
// import ReactJson from "react-json-view";
import { BiSolidFolderOpen } from "react-icons/bi";
import { MdHistory } from "react-icons/md";
import { TailSpin } from "react-loader-spinner";
import { BsFillKeyFill } from "react-icons/bs";
import { toast } from "react-toastify";
import "reactjs-popup/dist/index.css";
import "./index.css";

const Home = () => {
  const [collectionClick, setCollectionClick] = useState(true);
  const [historyClick, setHistoryClick] = useState(false);
  const [getCollection, setCollection] = useState("");
  const [newCollection, setNewCollection] = useState(false);
  const [collections, setCollectionsList] = useState([]);
  const [openCollection, setOpenCollection] = useState([]);
  const [historyCollection, setHistoryCollection] = useState([]);
  const [activeTab, setActiveTab] = useState("params");
  const [apiMethod, setApiMethod] = useState("");
  const [api, setApi] = useState("");
  const [authValue, setAuthValue] = useState("none");
  const [isCollectionLoading, setIsCollectionLoading] = useState(false);
  const [isNewCollectionLoading, setIsNewCollectionLoading] = useState(false);
  const [isDeleteCollectionLoading, setIsDeleteCollectionLoading] =
    useState(false);
  const [sameId, setIsSameId] = useState(false);
  const [response, setNewResponse] = useState();
  const [paramsKey, setParamsKey] = useState("");
  const [paramsValue, setParamsValue] = useState("");
  const [contentType, setContentType] = useState("");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [paramsList, setParamsList] = useState([]);
  const [body, setBody] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [activeRequest, setActiveRequest] = useState("");
  const [activeCollection, setActiveCollection] = useState("");
  const [bearerToken, setBearerToken] = useState("");
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [requestItem, setRequestItem] = useState(null);
  const [activeHistory, setActiveHistory] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCollections();
    getHistoryData();
  }, []);
  const fetchCollections = async () => {
    setIsCollectionLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        "https://backend-api-tester-t8sp.onrender.com/collections",
        options
      );
      const json = await response.json();
      const formattedList = json.collections.map((each) => {
        const newCollection = {
          id: each.id,
          userId: each.user_id,
          collectionName: each.collection,
          createdAt: each.created_at,
        };
        return newCollection;
      });
      setCollectionsList(formattedList);
      setIsCollectionLoading(false);
    } catch (error) {
      toast.error("No Collections. Something went wrong...!", {
        autoClose: 1800,
      });
    }
  };
  const showCollections = () => {
    setNewResponse("");
    setApiMethod("Method");
    setApi("");
    setContentType("");
    setBody("");
    setParamsKey("");
    setParamsValue("");
    setAuthUsername("");
    setAuthPassword("");
    setApiKey("");
    setBearerToken("");
    setStatus("");
    setHistoryClick(false);
    setCollectionClick(true);
    fetchCollections();
  };
  const showHistory = () => {
    setNewResponse("");
    setApiMethod("Method");
    setApi("");
    setContentType("");
    setBody("");
    setParamsKey("");
    setParamsValue("");
    setAuthUsername("");
    setAuthPassword("");
    setApiKey("");
    setStatus("");
    setBearerToken("");
    setCollectionClick(false);
    setHistoryClick(true);
    getHistoryData();
  };
  const addNewCollection = async () => {
    setIsNewCollectionLoading(true);
    setCollection("");
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    const collection = {
      newCollection: getCollection,
    };
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(collection),
      };
      const response = await fetch(
        "https://backend-api-tester-t8sp.onrender.com/collections",
        options
      );
      const json = await response.json();
      const newCollection = json.data[0];
      const formattedObject = {
        id: newCollection.id,
        userId: newCollection.user_id,
        collectionName: newCollection.collection,
        createdAt: newCollection.created_at,
      };
      setCollectionsList((prev) => [...prev, formattedObject]);
      setIsNewCollectionLoading(false);
      setNewCollection(false);
      toast.success(`${collection.newCollection}${" "} is created...!`, {
        autoClose: 1800,
      });
    } catch (error) {
      setNewCollection(false);
      toast.error("Something went wrong on creating Collection...!", {
        autoClose: 1800,
      });
    }
  };
  const onDeleteCollection = async (id) => {
    try {
      setIsDeleteCollectionLoading(true);
      const list = collections.filter((each) => each.id === id);
      const sameId = list[0].id;
      setIsSameId(sameId);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        `https://backend-api-tester-t8sp.onrender.com/collections/${id}`,
        options
      );
      const json = await response.json();
      const formattedList = json.exists.map((each) => {
        return {
          id: each.id,
          userId: each.user_id,
          collectionName: each.collection,
          createdAt: each.created_at,
        };
      });
      setCollectionsList(formattedList);
      setIsDeleteCollectionLoading(false);
      toast.success(`${list[0].collectionName} is deleted...!`, {
        autoClose: 1800,
      });
    } catch (error) {
      setIsDeleteCollectionLoading(false);
      toast.error("Something went wrong on deleting Collection", {
        autoclose: 1600,
      });
    }
  };
  const onSetActiveCollection = (id) => {
    setActiveCollection(id);
  };
  const onSetActiveRequest = async (id, obj) => {
    setRequestItem(obj);
    setActiveRequest(id);
  };
  const getActiveRequestHistory = async (id, requestName) => {
    if (!id) {
      return;
    }
    setNewResponse("");
    setApiMethod("Method");
    setApi("");
    setContentType("");
    setBody("");
    setParamsKey("");
    setParamsValue("");
    setAuthUsername("");
    setAuthPassword("");
    setApiKey("");
    setBearerToken("");
    setStatus("");
    setIsResponseLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };
    const serverResponse = await fetch(
      `https://backend-api-tester-t8sp.onrender.com/request/${id}`,
      options
    );
    const jsonResponse = await serverResponse.json();
    if (!serverResponse.ok) {
      setIsResponseLoading(false);
      toast.warning("No Response. Make an API call", { autoClose: 1600 });
    } else {
      setIsResponseLoading(false);
      let jsonBody = null;
      if (jsonResponse.message.body) {
        jsonBody = JSON.parse(jsonResponse.message.body);
      } else {
        jsonBody = "";
      }
      const formattedObj = {
        id: jsonResponse.message.id,
        userId: jsonResponse.message.user_id,
        requestId: jsonResponse.message.request_id,
        method: jsonResponse.message.method,
        url: jsonResponse.message.url,
        contentType: jsonResponse.message.headers["Content-Type"],
        body: JSON.stringify(jsonBody),
        params: jsonResponse.message.params,
        status: jsonResponse.message.status,
        response: jsonResponse.message.response,
        createdAt: jsonResponse.message.created_at,
      };
      console.log(formattedObj);
      toast.success(`${requestName} Request Response...!`, { autoClose: 1600 });
      setApi(formattedObj.url);
      setApiMethod(formattedObj.method);
      setBody(formattedObj.body);
      setContentType(formattedObj.contentType);
      setNewResponse(formattedObj.response);
      setStatus(formattedObj.status);
    }
  };
  const validateAndHandleRequest = () => {
    if (apiMethod !== "" && contentType !== "" && api !== "") {
      if (
        (paramsKey !== "" && paramsValue !== "") ||
        (authUsername !== "" && authPassword !== "") ||
        apiKey !== "" ||
        bearerToken !== ""
      ) {
        setNewResponse("");
        sendGetRequest();
        setApiMethod("Method");
        setApi("");
        setContentType("");
        setBody("");
        setParamsKey("");
        setParamsValue("");
        setAuthUsername("");
        setAuthPassword("");
        setApiKey("");
        setBearerToken("");
      } else {
        toast.error("Please provide Basic Auth details", {
          autoClose: 1200,
        });
      }
    } else {
      if (!contentType && !api && !apiMethod) {
        toast.error("Request details are incomplete", { autoClose: 1500 });
      } else if (contentType === "") {
        toast.error("Please Add Content Type", { autoClose: 1500 });
      } else if (api === "") {
        toast.error("Please Add API", { autoClose: 1500 });
      } else if (apiMethod === "") {
        toast.error("Please Select API Method", { autoClose: 1500 });
      }
    }
  };
  const sendGetRequest = async () => {
    try {
      setIsResponseLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      const apiData = {
        method: apiMethod,
        contentType: contentType,
        url: api,
        requestId: activeRequest,
        paramsList,
        externalAuth: {
          type: authValue,
          value: apiKey,
        },
        body: body,
        requestItem: requestItem,
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      };
      const response = await fetch("https://backend-api-tester-t8sp.onrender.com/proxy", options);
      const json = await response.json();
      const data = json.saveResponse.data[0];
      const formattedObj = {
        id: data.id,
        userId: data.user_id,
        requestId: data.request_id,
        url: data.url,
        method: data.method,
        params: data.params,
        headers: data.headers,
        body: data.body,
        response: data.response,
        status: data.status,
        createdAt: data.created_at,
      };
      setIsResponseLoading(false);
      toast.success("Request done successfully...!", { autoClose: 1800 });
      setNewResponse(json.data);
      setStatus(formattedObj.status);
    } catch (error) {
      toast.error("Something went wrong on request", { autoClose: 1800 });
    }
  };
  const getHistoryData = async () => {
    try {
      setIsCollectionLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch("https://backend-api-tester-t8sp.onrender.com/history", options);
      const json = await response.json();
      const formattedList = json.data.map((each) => {
        return {
          id: each.id,
          userId: each.user_id,
          collectionId: each.collection_id,
          collection: each.collection,
          requestId: each.request_id,
          requestName: each.request_name,
          requestUrl: each.request_url,
          url: each.url,
          method: each.method,
          headers: each.headers,
          params: each.params,
          body: each.body,
          response: each.response,
          status: each.status,
          createdAt: each.created_at,
        };
      });
      setIsCollectionLoading(false);
      if (!activeHistory && formattedList.length > 0)
        setActiveHistory(formattedList[0].requestId);
      setHistoryCollection(formattedList);
    } catch (error) {
      toast.error("Something went wrong on get History...!", {
        autoClose: 1800,
      });
    }
  };
  const setActiveHistoryId = (id) => {
    setActiveHistory(id);
    getHistoryRequest(id);
  };
  const getHistoryRequest = async (id) => {
    try {
      if (!id) {
        return;
      }
      setApi("");
      setApiMethod("");
      setBody("");
      setContentType("");
      setNewResponse("");
      setIsResponseLoading(true);
      setParamsList("");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const serverResponse = await fetch(
        `https://backend-api-tester-t8sp.onrender.com/history/${id}`,
        options
      );

      const jsonRes = await serverResponse.json();
      setIsResponseLoading(false);
      const formattedObj = {
        id: jsonRes.data[0].id,
        userId: jsonRes.data[0].user_id,
        collectionId: jsonRes.data[0].collection_id,
        collection: jsonRes.data[0].collection,
        requestId: jsonRes.data[0].request_id,
        requestName: jsonRes.data[0].request_name,
        requestUrl: jsonRes.data[0].request_url,
        url: jsonRes.data[0].url,
        method: jsonRes.data[0].method,
        headers: jsonRes.data[0].headers,
        params: jsonRes.data[0].params,
        body: jsonRes.data[0].body,
        response: jsonRes.data[0].response,
        status: jsonRes.data[0].status,
        createdAt: jsonRes.data[0].created_at,
      };
      toast.success(`${formattedObj.requestName}${" "} request Response...!`, {
        autoClose: 2000,
      });
      setApi(formattedObj.url);
      setApiMethod(formattedObj.method);
      setBody(formattedObj.body);
      setContentType(formattedObj.headers["Content-Type"]);
      setNewResponse(formattedObj.response);
      setStatus(formattedObj.status);
    } catch (error) {
      toast.error("Something went wrong...!", { autoClose: 1800 });
    }
  };
  const deleteHistoryRequest = async (id, requestName) => {
    try {
      setIsDeleteCollectionLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        `https://backend-api-tester-t8sp.onrender.com/history/requests/${id}`,
        options
      );
      const json = await response.json();
      const formattedList = json.existUsers.map((each) => {
        return {
          id: each.id,
          userId: each.user_id,
          collectionId: each.collection_id,
          collection: each.collection,
          requestId: each.request_id,
          requestName: each.request_name,
          requestUrl: each.request_url,
          url: each.url,
          method: each.method,
          headers: each.headers,
          params: each.params,
          body: each.body,
          response: each.response,
          status: each.status,
          createdAt: each.created_at,
        };
      });
      setIsDeleteCollectionLoading(false);
      if (response.ok) {
        toast.success(`${requestName}${" "} have deleted`, {
          autoClose: 2000,
        });
      }
      setNewResponse("");
      setApiMethod("Method");
      setApi("");
      setContentType("");
      setBody("");
      setParamsKey("");
      setParamsValue("");
      setAuthUsername("");
      setAuthPassword("");
      setApiKey("");
      setBearerToken("");
      setStatus("");
      setHistoryCollection(formattedList);
    } catch (error) {
      toast.error("Something went wrong...!", { autoClose: 1800 });
    }
  };
  const onSetParams = () => {
    setParamsList((prev) => [...prev, { key: paramsKey, value: paramsValue }]);
    setParamsKey("");
    setParamsValue("");
  };
  const onLogout = async () => {
    let { error } = await supabase.auth.signOut();
    navigate("/login");
    toast.error(error, { autoClose: 1200 });
  };
  const getStatusColor = (status) => {
    const numStatus = Number(status);
    if (numStatus >= 200 && numStatus <= 205) {
      return "text-green-500";
    }
    if (numStatus >= 300 && numStatus < 305) {
      return "text-yellow-500";
    }
    if (numStatus >= 400 && numStatus < 405) {
      return "text-red-500";
    }
    if (numStatus >= 500 && numStatus < 505) {
      return "text-red-500";
    }
  };
  return (
    <div className="h-screen overflow-hidden w-full bg-[url('https://marini.systems/wp-content/uploads/iStock-1459890079.jpg')] bg-cover bg-center">
      <nav className="bg-white/12 shadow-6xl shadow-[0_0_15px_2px_rgba(255,255,255,0.35)] w-full px-10 py-3 flex justify-between items-center fixed">
        <h1 className="tracking-[30px] text-5xl text-orange-400 font-bold hover:text-orange-500 hover:font-bold hover:[text-shadow:0_0_12px_rgba(255,165,0,3)] transition">
          API
        </h1>
        <button
          onClick={onLogout}
          type="button"
          className="hover:bg-black/10 px-4 py-2 font-semibold flex self-end shadow-4xl justify-center bg-white/15 font-semibold rounded-lg text-lg text-white active:scale-85 hover:bg-black/10 hover:border-1 transition cursor-pointer active:shadow-gray-500 active:shadow-md"
        >
          Logout
        </button>
      </nav>
      <div className="pt-18 h-screen flex items-center">
        <div className="w-[130px] py-4 px-2 h-full bg-white/10 border-r-2 shadow-[0px_6px_4px_2px_grey] border-white">
          <button
            type="button"
            onClick={showCollections}
            className={`${
              collectionClick ? "border-2 text-white" : ""
            } flex flex-col items-center h-16 shadow-[0px_2px_5px_0px_gray] py-1 mb-3 justify-center w-28 text-slate-300 rounded-md font-semibold tracking-wide active:scale-85 hover:bg-black/10 transition cursor-pointer active:shadow-gray-500 active:shadow-md`}
          >
            <BiSolidFolderOpen className="w-6 h-6 m-0" />
            <h1 className="text-sm font-semibold m-0">Collections</h1>
          </button>
          <button
            type="button"
            onClick={showHistory}
            className={`${
              historyClick ? "border-2 text-white" : ""
            } flex flex-col items-center h-16 shadow-[0px_2px_5px_0px_gray] py-1 justify-center w-28 text-slate-300 px-3 rounded-md font-semibold tracking-wide active:scale-85 hover:bg-black/10 transition cursor-pointer active:shadow-gray-500 active:shadow-md`}
          >
            <MdHistory className="w-7 h-7" />
            <h1 className="text-sm font-semibold">History</h1>
          </button>
        </div>
        {collectionClick && (
          <div className="w-[240px] py-3 flex flex-col items-center h-full bg-white/10 shadow-[0px_6px_4px_2px_grey] border-r-2 border-white">
            <h1 className="text-xl font-bold text-center text-cyan-300 underline">
              Your Collections
            </h1>
            <div className="flex justify-start w-full">
              <button
                type="button"
                onClick={() => setNewCollection((prev) => !prev)}
                className="bg-white/10 text-sm w-full text-white px-3 py-1 font-semibold flex items-center active:rounded-lg shadow-md gap-1 mt-1 active:scale-85 transition cursor-pointer"
              >
                <FaPlus />
                New Collection
              </button>
            </div>
            {newCollection ? (
              isNewCollectionLoading ? (
                <div className="flex justify-center items-center mt-5 pb-4">
                  <TailSpin
                    height="40"
                    width="40"
                    color="white"
                    ariaLabel="tail-spin-loading"
                    visible={isNewCollectionLoading}
                  />
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-1 h-25 items-center w-full p-1 bg-black/10 rounded-lg">
                    <input
                      type="text"
                      onChange={(event) => setCollection(event.target.value)}
                      className="border w-full h-10 mb-1 rounded-lg px-3 font-semibold outline-none"
                      placeholder="New Collection"
                    />
                    <button
                      type="button"
                      onClick={addNewCollection}
                      className="self-end bg-blue-500 cursor-pointer py-1 w-20 text-lg rounded-lg font-semibold"
                    >
                      Add
                    </button>
                  </div>
                </>
              )
            ) : (
              ""
            )}
            {collections.length > 0 || newCollection ? (
              isCollectionLoading ? (
                <div className="flex justify-center items-center pt-5">
                  <TailSpin
                    height="40"
                    width="40"
                    color="white"
                    ariaLabel="tail-spin-loading"
                    visible={isCollectionLoading}
                  />
                </div>
              ) : (
                <ul className="w-55 bg-black/20 rounded-md mt-1">
                  {collections.map((collection) => (
                    <Collections
                      key={collection.id}
                      eachCollection={collection}
                      collectionList={openCollection}
                      deleteCollection={onDeleteCollection}
                      sameId={sameId}
                      isDeleteCollectionLoading={isDeleteCollectionLoading}
                      requestId={onSetActiveRequest}
                      activeCollection={onSetActiveCollection}
                      activeId={activeRequest}
                      getResponse={getActiveRequestHistory}
                    />
                  ))}
                </ul>
              )
            ) : (
              <div className="flex flex-col justify-center items-center w-full p-2">
                <BiSolidFolderOpen className="w-10 h-10" />
                <h1 className="text-white text-lg font-semibold text-center">
                  Hey...! You have no Collections.
                </h1>
                <button
                  onClick={() => setNewCollection((prev) => !prev)}
                  className="text-gray-900 rounded-md text-md font-semibold bg-gray-100 cursor-pointer px-2 py-1 mt-1"
                >
                  Create Collection
                </button>
              </div>
            )}
          </div>
        )}
        {historyClick && (
          <div className="w-[240px] bg-white/10 h-full shadow-[0px_6px_4px_2px_grey] border-r-2 border-white">
            <h1 className="text-2xl font-bold text-center text-cyan-300 underline pt-3 tracking-wider">
              History
            </h1>
            <div className="flex justify-start w-full">
              <button
                type="button"
                onClick={() => {
                  setHistoryClick(false);
                  setCollectionClick(true);
                }}
                className="bg-white/10 text-sm w-full text-white px-3 py-1 font-semibold flex items-center active:rounded-lg shadow-md gap-1 mt-1 active:scale-85 transition cursor-pointer"
              >
                <FaPlus />
                New Collection
              </button>
            </div>
            {historyCollection.length > 0 && historyClick ? (
              isCollectionLoading ? (
                <div className="flex justify-center items-center pt-5">
                  <TailSpin
                    height="40"
                    width="40"
                    color="white"
                    ariaLabel="tail-spin-loading"
                    visible={isCollectionLoading}
                  />
                </div>
              ) : (
                <ul className="w-55 bg-black/20 rounded-md px-1 pb-2">
                  {historyCollection.map((eachObj) => (
                    <History
                      key={eachObj.id}
                      historyObj={eachObj}
                      getActiveId={setActiveHistoryId}
                      isActive={eachObj.requestId === activeHistory}
                      getDeleteId={deleteHistoryRequest}
                      isDeleteCollectionLoading={isDeleteCollectionLoading}
                    />
                  ))}
                </ul>
              )
            ) : (
              <div className="flex flex-col justify-center items-center w-full p-2">
                <MdHistory className="w-10 h-10" />
                <h1 className="text-white text-lg font-semibold text-center">
                  Hey...! You have no History.
                </h1>
                <button
                  onClick={() => {
                    setHistoryClick(false);
                    setCollectionClick(true);
                  }}
                  className="text-gray-900 rounded-md text-md font-semibold bg-gray-100 cursor-pointer px-2 py-1 mt-1"
                >
                  Create Collection
                </button>
              </div>
            )}
          </div>
        )}
        <div
          className={`
            "w-[520px]"
            bg-white/20 h-full py-4 px-5 shadow-[0px_6px_4px_2px_grey] border-r-2 border-white`}
        >
          <h1 className="text-2xl text-center font-bold text-white tracking-wider mb-4">
            New Request
          </h1>
          <div className="flex justify-center items-center">
            <select
              onChange={(event) => setApiMethod(event.target.value)}
              value={apiMethod}
              className="bg-sky-900 text-white cursor-pointer font-semibold rounded-l-md outline-none p-2"
            >
              <option
                value="Method"
                className="bg-white/10 text-green-500 hover:bg-white font-semibold"
              >
                Method
              </option>
              <option
                value="GET"
                className="bg-white/10 text-green-500 hover:bg-white font-semibold"
              >
                GET
              </option>
              <option
                value="POST"
                className="bg-white/10 text-yellow-500 font-semibold"
              >
                POST
              </option>
              <option
                value="PUT"
                className="bg-white/10 text-blue-500 font-semibold"
              >
                PUT
              </option>
              <option
                value="DELETE"
                className="bg-white/10 text-red-500 font-semibold"
              >
                DELETE
              </option>
            </select>
            <input
              type="text"
              value={api}
              onChange={(event) => setApi(event.target.value)}
              className="border-1 h-[39px] w-88 pl-3 outline-none placeholder-white font-medium focus:bg-black/40"
              placeholder="Enter Your API"
            />
            <button
              type="button"
              onClick={validateAndHandleRequest}
              className="bg-sky-900 w-20 text-white rounded-r-md h-[39px] font-semibold text-lg active:scale-90 active:rounded-md transition cursor-pointer active:shadow-gray-500 active:shadow-md"
            >
              Send
            </button>
          </div>
          <div className="flex justify-evenly items-center mt-3">
            <button
              onClick={() => setActiveTab("params")}
              className="border-1 border-white text-white w-full cursor-pointer text-center active:scale-95 active:rounded-md transition text-lg font-semibold bg-sky-900 rounded-l-md p-1"
            >
              Params
            </button>
            <button
              onClick={() => setActiveTab("headers")}
              className="border-1 border-white text-white w-full cursor-pointer text-center active:scale-95 active:rounded-md transition text-lg font-semibold bg-sky-900 p-1"
            >
              Headers
            </button>
            <button
              onClick={() => setActiveTab("body")}
              className="border-1 border-white text-white w-full cursor-pointer text-center active:scale-95 active:rounded-md transition text-lg font-semibold bg-sky-900 rounded-r-md p-1"
            >
              Body
            </button>
          </div>
          <div className="h-80 rounded-lg py-4 mt-1 border-2 bg-black/40 text-center">
            {activeTab === "params" && (
              <>
                <div>
                  <h1 className="mb-3 font-semibold text-2xl text-white">
                    Params
                  </h1>
                  <div className="flex justify-center items-center">
                    <h1 className="border-1 w-55 pt-1 pl-3 text-left h-10 font-semibold bg-sky-900 text-white text-xl tracking-wide">
                      Key
                    </h1>
                    <h1 className="border-1 w-55 pt-1 pl-3 text-left h-10 font-semibold bg-sky-900 text-white text-xl tracking-wide">
                      Value
                    </h1>
                  </div>
                  <div className="flex justify-center items-center">
                    <input
                      className="text-lg text-white font-semibold placeholder-white outline-none h-10 bg-white/10 w-55 pl-3 border-1 border-white"
                      type="text"
                      placeholder="key"
                      value={paramsKey}
                      onChange={(event) => setParamsKey(event.target.value)}
                    />
                    <input
                      className="text-lg text-white font-semibold placeholder-white outline-none h-10 bg-white/10 w-55 pl-3 border-1 border-white"
                      type="text"
                      placeholder="value"
                      value={paramsValue}
                      onChange={(event) => setParamsValue(event.target.value)}
                    />
                  </div>
                  <button
                    onClick={onSetParams}
                    className="mt-3 text-white w-20 cursor-pointer text-center active:scale-85 active:rounded-md transition text-lg font-semibold bg-sky-900 rounded-md p-1"
                  >
                    Add
                  </button>
                  <p className="text-gray-100 italic text-sm font-medium mt-3">
                    If you have more params, Enter and click Add Button.
                  </p>
                  <p className="text-gray-100 italic text-sm font-medium ">
                    Add them in order.
                  </p>
                </div>
              </>
            )}
            {activeTab === "headers" && (
              <div className="flex justify-evenly items-center">
                <div className="border-r-2 w-full h-70">
                  <h1 className="font-bold text-xl text-white underline mb-4">
                    Authorization
                  </h1>
                  <select
                    value={authValue}
                    onChange={(event) => setAuthValue(event.target.value)}
                    className="bg-sky-900 text-white cursor-pointer w-50 mb-4 font-semibold rounded-md outline-none p-2"
                  >
                    <option className="text-white font-medium">none</option>
                    <option
                      className="text-white font-medium"
                      value="Basic Auth"
                    >
                      Basic Auth
                    </option>
                    <option
                      className="text-white font-medium"
                      value="Bearer Token"
                    >
                      Bearer Token
                    </option>
                    <option className="text-white font-medium" value="Api Key">
                      Api Key
                    </option>
                  </select>
                  {authValue === "none" && (
                    <div>
                      <div className="flex justify-center items-center">
                        <BsFillKeyFill className="text-white h-12 w-12" />
                      </div>
                      <h1 className="text-white font-semibold text-md">
                        Add Authorization Keys or Tokens...!
                      </h1>
                    </div>
                  )}
                  {authValue === "Basic Auth" && (
                    <div>
                      <div className="flex flex-col items-start px-3">
                        <label className="mb-1 text-white text-left font-semibold">
                          Email
                        </label>
                        <input
                          className="placeholder-slate-300 outline-none text-white text-md font-semibold border rounded-lg py-2 w-50 px-2 mb-4"
                          type="text"
                          placeholder="username/e-mail"
                          value={authUsername}
                          onChange={(event) =>
                            setAuthUsername(event.target.value)
                          }
                        />
                      </div>
                      <div className="flex flex-col items-start px-3">
                        <label className="mb-1 text-white text-left font-semibold">
                          Password
                        </label>
                        <input
                          className="placeholder-slate-300 text-white text-md outline-none font-semibold border rounded-lg w-50 py-2 px-2"
                          type="password"
                          placeholder="password"
                          value={authPassword}
                          onChange={(event) =>
                            setAuthPassword(event.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}
                  {authValue === "Bearer Token" && (
                    <div className="px-2 flex flex-col jistify-center">
                      <h1 className="text-left text-lg text-white font-semibold mb-1">
                        Token:
                      </h1>
                      <div className="flex justify-center items-center">
                        <span className="bg-white text-black text-md rounded-l-md font-semibold px-2 py-2 h-[40px]">
                          Bearer{" "}
                        </span>
                        <input
                          className="placeholder-slate-300 text-white outline-none text-md py-2 w-45 h-[39px] px-2 font-semibold border rounded-r-lg"
                          type="password"
                          placeholder="Token"
                          value={bearerToken}
                          onChange={(event) =>
                            setBearerToken(event.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}
                  {authValue === "Api Key" && (
                    <div className="px-2">
                      <div className="flex flex-col items-start px-2">
                        <label className="mb-1 text-white text-left font-semibold">
                          API Key
                        </label>
                        <input
                          className="placeholder-slate-300 outline-none text-white text-md font-semibold border rounded-lg px-2 py-1"
                          type="password"
                          onChange={(event) => setApiKey(event.target.value)}
                          value={apiKey}
                          placeholder="Api key"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="border-0 w-full h-70">
                  <h1 className="font-bold text-xl text-white underline mb-4">
                    Content - Type
                  </h1>
                  <div className="px-4 flex flex-col justify-center">
                    <p className="text-white text-lg font-semibold text-left">
                      Content-Type:
                    </p>
                    <input
                      className="placeholder-slate-300 text-md text-white font-semibold outline-none h-9 bg-black/10 w-50 pl-3 rounded-sm border-1 border-white"
                      type="text"
                      value={contentType}
                      placeholder="content-type"
                      onChange={(event) => setContentType(event.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "body" && (
              <div>
                <h1 className="font-bold text-2xl text-white underline tracking-wider mb-2">
                  Body
                </h1>
                <h1 className="text-left text-sky-900 bg-white text-center rounded-sm w-26 text-lg font-bold ml-6 pl-3">
                  Raw Data
                </h1>
                <div>
                  <textarea
                    className="mt-1 py-2 px-3 outline-none border-1 border-white rounded-lg font-semibold text-md overflow-auto scrollbar"
                    cols={55}
                    rows={7}
                    type="text"
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    placeholder="Enter Your Data to Send to an API"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="h-full w-[400px] py-4 border">
          <h1 className="text-center text-2xl font-semibold text-white underline mb-3">
            Response
          </h1>
          {response && (
            <div className="flex justify-start items-center w-full">
              <h1 className="text-2xl font-semibold mx-2">Status: </h1>
              <h1
                className={`${getStatusColor(
                  status
                )} font-bold text-2xl tracking-widest`}
              >
                {status}
              </h1>
            </div>
          )}
          <div className="w-90 h-full p-3 overflow-auto scrollbar">
            {isResponseLoading ? (
              <div className="flex justify-center items-center h-80 mb-3 mt-3">
                <TailSpin
                  height="60"
                  width="80"
                  color="white"
                  ariaLabel="tail-spin-loading"
                  visible={isResponseLoading}
                />
              </div>
            ) : (
              response && (
                <div className="bg-gray-200">
                  <JsonView
                    value={response || {}}
                    collapsed={false}
                    enableClipboard={true}
                    displayDataTypes={false}
                    theme="monakai"
                    name={false}
                    width={250}
                  />
                </div>
              )
            )}
            {!response && (
              <div className="flex flex-col justify-center items-center h-full">
                <img
                  height="250"
                  width="250"
                  alt=""
                  src="https://postman.com/_aether-assets/illustrations/light/illustration-hit-send.svg"
                  data-testid="illustration-hit-send"
                  aria-hidden="true"
                  draggable="false"
                  className="aether-illustration undefined bg-white absolute
              object-cover [mask-repeat:no-repeat] [mask-size:contain] [mask-image:radial-gradient(circle,white_-150%,transparent_100%)]"
                />
                <h1 className="z-1 text-white text-xl text-center font-semibold">
                  Start Requesting to Test an API and get the Response here...!
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
