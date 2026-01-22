import { useState, useEffect } from "react";
import { RiArrowDropLeftLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { supabase } from "../supabase";
import { BsThreeDotsVertical } from "react-icons/bs";
import { TailSpin } from "react-loader-spinner";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";

const Collections = (props) => {
  const [openCollection, setOpenCollection] = useState([]);
  const [requestsList, setRequestsList] = useState([]);
  const [localList, setLoaclList] = useState(() => {
    const stored = localStorage.getItem("requests");
    return stored ? JSON.parse(stored) : [];
  });
  const [requestItem, setRequestItem] = useState(false);
  const [requestForm, setRequestForm] = useState(true);
  const [newRequestItem, setNewRequestItem] = useState(false);
  const [newRequest, setNewRequest] = useState("");
  const [newApi, setNewApi] = useState("");
  const {
    eachCollection,
    deleteCollection,
    isDeleteCollectionLoading,
    sameId,
    requestId,
    activeId,
    getResponse,
  } = props;
  const { id, collectionName } = eachCollection;
  const [activeCollectionId, setActiveCollection] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  useEffect(() => {
    getCollectionItems(id);
  }, []);

  const getCollectionItems = async (id) => {
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
      `http://localhost:3000/requests/${id}`,
      options
    );
    const json = await response.json();
    console.log(json);
    if (json.data.length > 0) {
      setRequestItem(true);
      setShowItems(true);
    }
    const formattedList = json.data.map((each) => {
      return {
        id: each.id,
        userId: each.user_id,
        collectionId: each.collection_id,
        requestName: each.request_name,
        requestUrl: each.request_url,
        createdAt: each.created_at,
      };
    });
    setRequestsList(formattedList);
    return formattedList;
  };
  const onOpenCollection = async (collectionId) => {
    if (requestItem) {
      setRequestForm(false);
    } else {
      setRequestForm(true);
    }
    setActiveCollection(collectionId);
    setOpenCollection((prev) =>
      prev.includes(collectionId)
        ? prev.filter((collectionID) => collectionID !== collectionId)
        : [...prev, collectionId]
    );
    getCollectionItems(collectionId);
    const filteredList = requestsList.filter(
      (each) => each.collectionId === collectionId
    );
    setRequestsList(filteredList);
  };
  const onCreateNewRequest = async () => {
    setIsLoading(true);
    setShowItems(true);
    setRequestItem(false);
    setRequestForm(false);
    setNewRequestItem(false);
    setNewApi("");
    setNewRequest("");
    const newReq = {
      id,
      method: "GET",
      requestName: newRequest,
      api: newApi,
    };
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newReq),
    };
    const response = await fetch("http://localhost:3000/requests", options);
    const json = await response.json();
    const formattedObj = json.request.map((each) => {
      return {
        id: each.id,
        userId: each.user_id,
        collectionId: each.collection_id,
        requestName: each.request_name,
        requestUrl: each.request_url,
        createdAt: each.created_at,
      };
    });
    const newRequestItem = { ...formattedObj[0], collection: collectionName };
    setIsLoading(false);
    toast.success(`${formattedObj[0].requestName}${" "} is created...!`, {
      autoClose: 1800,
    });
    requestId(newRequestItem.id, newRequestItem);
    setLoaclList((prev) => {
      const updated = [...prev, newRequestItem];
      localStorage.setItem("requests", JSON.stringify(updated));
      return updated;
    });
    setRequestsList((prev) => [...formattedObj, ...prev]);
  };
  const onAddNewRequest = () => {
    setNewRequestItem((prev) => !prev);
  };
  const onDeleteRequest = async (id) => {
    try {
      const name = requestsList.filter((each) => each.id === id);
      setDeleteId(id);
      setIsDeleteLoading(true);
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
        `http://localhost:3000/requests/${id}`,
        options
      );
      if (response.ok) {
        toast.success(`${name[0].requestName}${" "} have deleted`, {
          autoClose: 1800,
        });
      }
      const json = await response.json();
      if (json.existUsers.length === 0) {
        setRequestForm(true);
        setRequestItem(false);
      }

      const formattedList = json.existUsers.map((each) => {
        return {
          id: each.id,
          userId: each.user_id,
          collectionId: each.collection_id,
          requestName: each.request_name,
          requestUrl: each.request_url,
          createdAt: each.created_at,
        };
      });
      const filteredList = formattedList.filter(
        (each) => each.collectionId === activeCollectionId
      );
      if (filteredList.length === 0) {
        setRequestForm(true);
        setRequestItem(false);
      }
      setIsDeleteLoading(false);
      setRequestsList(filteredList);
      setLoaclList((p) => {
        const updated = requestsList.filter((r) => r.id !== id);
        localStorage.setItem("requests", JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      toast.error(error, { autoClose: 1800 });
    }
  };
  const onDeleteCollection = (collectionId) => {
    deleteCollection(collectionId);
  };
  const renderRequests = (request) => {
    const { id, requestName, requestUrl } = request;
    const activeRequest =
      activeId === id ? "bg-black/10 border" : "bg-white/10";
    const setActiveId = () => {
      requestId(id);
      getResponse(id, requestName);
    };
    return (
      <li
        key={id}
        className={`${activeRequest} w-full flex justify-evenly rounded-md mb-1 mt-1`}
      >
        <button
          className="w-90 flex flex-col justify-evenly items-center cursor-pointer overflow-auto scrollbar active:scale-95 transition"
          onClick={setActiveId}
        >
          {showItems && (
            <div className="flex justify-between items-center w-full px-2">
              <h1 className="text-md font-semibold">{requestName}</h1>
            </div>
          )}
          {showItems && (
            <div className="flex items-center justify-start w-full overflow-auto scrollbar px-1 pb-1 gap-2">
              <h1 className={`text-green-400 text-md font-semibold`}>GET</h1>
              <h1 className="text-white text-sm">{requestUrl}</h1>
            </div>
          )}
        </button>
        {isDeleteLoading && deleteId === id ? (
          <div className="flex justify-start items-start pt-1 pr-1">
            <TailSpin
              height="20"
              width="20"
              color="white"
              ariaLabel="tail-spin-loading"
              visible={isDeleteLoading}
            />
          </div>
        ) : (
          <>
            <button
              className="self-start text-white text-lg rounded-lg mr-2 mt-1 cursor-pointer relative group"
              onClick={() => onDeleteRequest(id)}
            >
              {" "}
              <BsThreeDots />{" "}
              <span
                className="absolute right-5 -top-2 hidden group-hover:block
                bg-gray-800 text-white text-xs font-medium py-1 px-2
                rounded shadow-lg whitespace-nowrap"
              >
                Delete Request
              </span>
            </button>
          </>
        )}
      </li>
    );
  };

  return (
    <li className="px-1 pb-1">
      <div className="flex justify-between items-center pr-2">
        <button
          onClick={() => onOpenCollection(id)}
          className={`${
            openCollection.includes(id) ? "text-white" : ""
          } hover:bg-white/10 hover:rounded-md flex justify-between text-slate-300 cursor-pointer items-center w-full px-1`}
        >
          <h1 className="text-md font-semibold">{collectionName}</h1>
          <div className="flex justify-end items-center gap-0 relative">
            {openCollection.includes(id) ? (
              <div className="flex justify-center items-center">
                <RiArrowDropUpLine className="text-4xl" />
              </div>
            ) : (
              <RiArrowDropLeftLine className="text-4xl" />
            )}
          </div>
        </button>
        {isDeleteCollectionLoading && sameId === id ? (
          <div className="flex justify-center items-center">
            <TailSpin
              height="22"
              width="22"
              color="white"
              ariaLabel="tail-spin-loading"
              visible={isDeleteCollectionLoading}
            />
          </div>
        ) : (
          <button
            onClick={() => onDeleteCollection(id)}
            className="relative group"
          >
            <BsThreeDotsVertical className="cursor-pointer" />
            <span
              className="absolute right-0 -top-7 hidden group-hover:block
                bg-gray-800 text-white text-xs font-medium py-1 px-2 
                rounded shadow-lg whitespace-nowrap"
            >
              Delete Collection
            </span>
          </button>
        )}
      </div>
      {openCollection.includes(id) && requestsList.length > 0 && (
        <>
          <button
            type="button"
            className="flex items-center px-2 mt-1 py-1 text-xs rounded-sm cursor-pointer bg-white/10 active:scale-85 hover:border hover:bg-black/10 transition mb-1"
            onClick={onAddNewRequest}
          >
            <FaPlus /> New Request
          </button>
          {isLoading ? (
            <div className="flex justify-center items-center py-2">
              <TailSpin
                height="30"
                width="30"
                color="white"
                ariaLabel="tail-spin-loading"
                visible={isLoading}
              />
            </div>
          ) : (
            newRequestItem && (
              <div className="flex flex-col w-full gap-2 px-2 mb-2">
                <input
                  className="border w-full h-8 pl-2 rounded-sm placeholder-gray-400 font-semibold text-sm outline-none"
                  type="text"
                  placeholder="API Name"
                  value={newRequest}
                  onChange={(event) => setNewRequest(event.target.value)}
                />
                <input
                  className="border w-full h-8 pl-2 rounded-sm placeholder-gray-400 font-semibold text-sm outline-none"
                  type="text"
                  placeholder="https://localhost:3000"
                  value={newApi}
                  onChange={(event) => setNewApi(event.target.value)}
                />
                <button
                  onClick={onCreateNewRequest}
                  className="bg-sky-900 w-22 self-center text-white text-md px-2 p-1 cursor-pointer rounded-md"
                >
                  Save
                </button>
              </div>
            )
          )}
        </>
      )}
      {openCollection.includes(id) &&
      requestsList.length === 0 &&
      requestForm ? (
        <div className="px-2 flex flex-col justify-center items-center pb-2">
          <p className="text-sm text-gray-300 font-semibold">
            <span className="text-md underline mr-1">{collectionName}</span> is
            Empty
          </p>
          <button
            onClick={() => {
              setRequestForm(false);
              setRequestItem(true);
            }}
            className="text-blue-600 text-md font-bold tracking-wide cursor-pointer text-center w-full mt-1"
          >
            Add Request
          </button>
        </div>
      ) : (
        ""
      )}
      {openCollection.includes(id) &&
        requestsList.length === 0 &&
        requestItem && (
          <div className="flex flex-col w-full gap-2 px-2 pb-2">
            <input
              className="border w-full h-8 pl-2 rounded-sm font-semibold placeholder-gray-400 text-sm outline-none"
              type="text"
              placeholder="API Name"
              value={newRequest}
              onChange={(event) => setNewRequest(event.target.value)}
            />
            <input
              className="border w-full h-8 pl-2 rounded-sm font-semibold placeholder-gray-400 text-sm outline-none"
              type="text"
              placeholder="http://localhost:3000"
              value={newApi}
              onChange={(event) => setNewApi(event.target.value)}
            />
            <button
              onClick={onCreateNewRequest}
              className="bg-sky-900 w-22 self-center text-white text-md font-semibold px-2 p-1 cursor-pointer rounded-md"
            >
              Save
            </button>
          </div>
        )}
      {openCollection.includes(id) &&
        requestsList.length === 0 &&
        isLoading && (
          <div className="flex justify-center items-center pb-3">
            <TailSpin
              height="30"
              width="30"
              color="white"
              ariaLabel="tail-spin-loading"
              visible={isLoading}
            />
          </div>
        )}
      <ul className="overflow-y-auto scrollbar h-full">
        {openCollection.includes(id) &&
          requestsList.length > 0 &&
          requestsList.map((eachRequest) => renderRequests(eachRequest))}
      </ul>
    </li>
  );
};

export default Collections;
