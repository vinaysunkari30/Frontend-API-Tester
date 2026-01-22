import { useState, useEffect } from "react";
import { supabase } from "../supabase";

import { TailSpin } from "react-loader-spinner";
import { BsThreeDots } from "react-icons/bs";

const History = (props) => {
  const {
    historyObj,
    getActiveId,
    isActive,
    getDeleteId,
    isDeleteCollectionLoading,
  } = props;
  const { id, requestId, requestName, requestUrl, method } = historyObj;
  const [deleteId, setDeleteId] = useState("");

  const getMethodColor = (method) => {
    switch (method) {
      case "GET":
        return "text-green-500";
      case "POST":
        return "text-yellow-500";
      case "PUT":
        return "text-blue-500";
      case "DELETE":
        return "text-red-500";
      default:
        return "text-green-500";
    }
  };
  const setActiveId = (requestId) => {
    getActiveId(requestId);
  };
  const onDeleteRequest = async(id) => {
    setDeleteId(id);
    getDeleteId(id, requestName)
  };
  return (
    <li
      key={id}
      className={`${
        isActive ? "bg-black/10 border" : "bg-white/10"
      } w-full flex justify-evenly rounded-md mb-1 mt-1`}
    >
      <button
        className="w-90 flex flex-col justify-evenly items-center cursor-pointer overflow-auto scrollbar active:scale-95 transition"
        onClick={() => setActiveId(requestId)}
      >
        <div className="flex justify-between items-center w-full px-2">
          <h1 className="text-md font-semibold">{requestName}</h1>
        </div>
        <div className="flex items-center justify-start w-full overflow-auto scrollbar px-1 pb-1 gap-2">
          <h1 className={`${getMethodColor(method)} text-md font-semibold`}>
            {method}
          </h1>
          <h1 className="text-white text-sm">{requestUrl}</h1>
        </div>
      </button>
      {isDeleteCollectionLoading && deleteId === id ? (
        <div className="flex justify-start items-start pt-1 pr-1">
          <TailSpin
            height="20"
            width="20"
            color="white"
            ariaLabel="tail-spin-loading"
            visible={isDeleteCollectionLoading}
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

export default History;
