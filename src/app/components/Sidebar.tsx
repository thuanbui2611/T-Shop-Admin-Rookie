import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SidebarLinkGroup from "./SidebarLinkGroup";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <p className=" text-3xl font-bold text-red-700 text-center">
            T-Shop Admin
          </p>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>
            {/* <!-- Menu Item Dashboard --> */}
            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <NavLink
                  to="/dashboard"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    (pathname === "/" || pathname.includes("dashboard")) &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                      fill=""
                    />
                    <path
                      d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                      fill=""
                    />
                    <path
                      d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                      fill=""
                    />
                    <path
                      d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                      fill=""
                    />
                  </svg>
                  Dashboard
                </NavLink>
              </li>
            </ul>
          </div>

          {/* <!-- Management Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MANAGEMENT
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Products --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === "/types" ||
                  pathname === "/brands" ||
                  pathname === "/model-products" ||
                  pathname === "/colors"
                }
              >
                {(handleClick, open) => {
                  return (
                    <>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 
                        ${
                          pathname === "/types" ||
                          pathname === "/brands" ||
                          pathname === "/model-products" ||
                          pathname === "/colors"
                            ? "bg-graydark dark:bg-meta-4"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex pr-1">
                          <div className="flex relative">
                            <svg
                              fill="#ffffff"
                              version="1.1"
                              id="Capa_1"
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                              width="20px"
                              height="20px"
                              viewBox="0 0 358.945 358.945"
                              xmlSpace="preserve"
                              stroke="#ffffff"
                            >
                              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                              <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></g>
                              <g id="SVGRepo_iconCarrier">
                                <g>
                                  <g>
                                    <g>
                                      <path d="M307.633,172.984c-6.389,0-12.61,1.174-18.524,3.479l-2.822-4.597l33.765-4.5c0.456-0.063,11.241-1.459,12.688-9.508 c2.558-14.259-27.574-37.293-92.126-70.442c-5.915-2.747-10.227-4.086-13.181-4.086c-3.524,0-4.857,1.892-5.338,3.005 c-2.606,6.008,9.121,21.804,20.645,35.245c-12.677-6.737-33.339-15.783-52.885-15.783c-9.833,0-18.417,2.306-25.517,6.854 c-5.626,3.591-12.784,13.06-21.344,28.138c-0.375-0.597-0.987-1.015-1.684-1.132l-50.752-8.983l-7.071-21.227 c-0.282-0.864-1.009-1.486-1.907-1.672c-0.973-0.184-24.085-4.666-44.883-4.666c-22.902,0-35.218,5.338-36.62,15.853 c-3.278,24.761,99.893,57.601,121.84,64.294c-5.134,11.463-9.206,21.227-11.334,26.469c-6.395-21.432-26.667-36.74-49.146-36.74 c-28.286,0-51.314,23.031-51.314,51.332c0,28.288,23.028,51.299,51.314,51.299c22.638,0,42.763-15.084,49.164-36.756h121.27 c0.823,0,1.615-0.414,2.078-1.099l37.308-54.812l1.999,3.255c-10.778,9.733-16.939,23.574-16.939,38.106 c0,28.294,23.022,51.299,51.317,51.299s51.312-23.005,51.312-51.299C358.945,196.016,335.921,172.984,307.633,172.984z M292.639,132.17c0.985-1.36,2.9-2.054,5.717-2.054c1.934,0,4.257,0.324,6.917,0.981c20.903,15.165,23.089,22.71,22.536,25.875 c-0.78,4.398-8.305,5.419-8.395,5.425l-16.213,2.165C297.557,155.669,288.466,138.072,292.639,132.17z M93.274,219.038 c-0.459,0.589-1.198,0.942-1.96,0.942H54.924v13.859h34.735c0.834,0,1.625,0.414,2.083,1.135c0.469,0.696,0.556,1.598,0.21,2.359 c-5.233,12.244-17.219,20.158-30.522,20.158c-18.306,0-33.194-14.892-33.194-33.176c0-18.32,14.889-33.201,33.194-33.201 c15.574,0,28.85,10.617,32.33,25.797C93.938,217.669,93.76,218.443,93.274,219.038z M307.633,257.492 c-18.297,0-33.183-14.892-33.183-33.182c0-8.972,3.531-17.391,9.968-23.695c0.559-0.553,1.321-0.841,2.108-0.703 c0.708,0.091,1.387,0.523,1.789,1.172l14.352,23.322l7.302-4.491l-14.346-23.323c-0.384-0.637-0.48-1.435-0.228-2.161 c0.258-0.721,0.834-1.285,1.555-1.525c3.482-1.189,7.08-1.802,10.688-1.802c18.291,0,33.183,14.893,33.183,33.201 C340.81,242.601,325.917,257.492,307.633,257.492z"></path>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </svg>
                            <svg
                              className="absolute -right-[10px]"
                              width={12}
                              height={12}
                              viewBox="0 0 1024 1024"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="#ffffff"
                              stroke="#ffffff"
                              strokeWidth="31.744"
                            >
                              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                              <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></g>
                              <g id="SVGRepo_iconCarrier">
                                <path
                                  fill="#ffffff"
                                  d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384zm0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256z"
                                ></path>
                              </g>
                            </svg>
                          </div>
                        </div>
                        Product Config
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && "rotate-180"
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && "hidden"
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/types"
                              className={({ isActive }) =>
                                "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                (isActive && "!text-white")
                              }
                            >
                              Types
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/brands"
                              className={
                                "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                (pathname === "/brand" && "!text-white")
                              }
                            >
                              Brand
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/model-products"
                              className={({ isActive }) =>
                                "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                (isActive && "!text-white")
                              }
                            >
                              Model
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/colors"
                              className={({ isActive }) =>
                                "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                (isActive && "!text-white")
                              }
                            >
                              Colors
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Brand --> */}
              {/* <!-- Menu Item Products --> */}
              <li>
                <NavLink
                  to="/products"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("products") &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <svg
                    fill="#ffffff"
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="20px"
                    height="20px"
                    viewBox="0 0 358.945 358.945"
                    xmlSpace="preserve"
                    stroke="#ffffff"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <g>
                        <g>
                          <g>
                            <path d="M307.633,172.984c-6.389,0-12.61,1.174-18.524,3.479l-2.822-4.597l33.765-4.5c0.456-0.063,11.241-1.459,12.688-9.508 c2.558-14.259-27.574-37.293-92.126-70.442c-5.915-2.747-10.227-4.086-13.181-4.086c-3.524,0-4.857,1.892-5.338,3.005 c-2.606,6.008,9.121,21.804,20.645,35.245c-12.677-6.737-33.339-15.783-52.885-15.783c-9.833,0-18.417,2.306-25.517,6.854 c-5.626,3.591-12.784,13.06-21.344,28.138c-0.375-0.597-0.987-1.015-1.684-1.132l-50.752-8.983l-7.071-21.227 c-0.282-0.864-1.009-1.486-1.907-1.672c-0.973-0.184-24.085-4.666-44.883-4.666c-22.902,0-35.218,5.338-36.62,15.853 c-3.278,24.761,99.893,57.601,121.84,64.294c-5.134,11.463-9.206,21.227-11.334,26.469c-6.395-21.432-26.667-36.74-49.146-36.74 c-28.286,0-51.314,23.031-51.314,51.332c0,28.288,23.028,51.299,51.314,51.299c22.638,0,42.763-15.084,49.164-36.756h121.27 c0.823,0,1.615-0.414,2.078-1.099l37.308-54.812l1.999,3.255c-10.778,9.733-16.939,23.574-16.939,38.106 c0,28.294,23.022,51.299,51.317,51.299s51.312-23.005,51.312-51.299C358.945,196.016,335.921,172.984,307.633,172.984z M292.639,132.17c0.985-1.36,2.9-2.054,5.717-2.054c1.934,0,4.257,0.324,6.917,0.981c20.903,15.165,23.089,22.71,22.536,25.875 c-0.78,4.398-8.305,5.419-8.395,5.425l-16.213,2.165C297.557,155.669,288.466,138.072,292.639,132.17z M93.274,219.038 c-0.459,0.589-1.198,0.942-1.96,0.942H54.924v13.859h34.735c0.834,0,1.625,0.414,2.083,1.135c0.469,0.696,0.556,1.598,0.21,2.359 c-5.233,12.244-17.219,20.158-30.522,20.158c-18.306,0-33.194-14.892-33.194-33.176c0-18.32,14.889-33.201,33.194-33.201 c15.574,0,28.85,10.617,32.33,25.797C93.938,217.669,93.76,218.443,93.274,219.038z M307.633,257.492 c-18.297,0-33.183-14.892-33.183-33.182c0-8.972,3.531-17.391,9.968-23.695c0.559-0.553,1.321-0.841,2.108-0.703 c0.708,0.091,1.387,0.523,1.789,1.172l14.352,23.322l7.302-4.491l-14.346-23.323c-0.384-0.637-0.48-1.435-0.228-2.161 c0.258-0.721,0.834-1.285,1.555-1.525c3.482-1.189,7.08-1.802,10.688-1.802c18.291,0,33.183,14.893,33.183,33.201 C340.81,242.601,325.917,257.492,307.633,257.492z"></path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                  Products
                </NavLink>
              </li>
              {/* <!-- Menu Item Transaction --> */}
              <li>
                <NavLink
                  to="/transactions"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("transactions") &&
                    "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <img
                    className="h-5 w-5"
                    src={require("../assets/images/iconSideBar/transaction.png")}
                  />
                  Transactions
                </NavLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              OTHERS
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Users --> */}
              <li>
                <NavLink
                  to="/users"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("users") && "bg-graydark dark:bg-meta-4"
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M1.5 6.5C1.5 3.46243 3.96243 1 7 1C10.0376 1 12.5 3.46243 12.5 6.5C12.5 9.53757 10.0376 12 7 12C3.96243 12 1.5 9.53757 1.5 6.5Z"
                        fill="#ffffff"
                      ></path>
                      <path
                        d="M14.4999 6.5C14.4999 8.00034 14.0593 9.39779 13.3005 10.57C14.2774 11.4585 15.5754 12 16.9999 12C20.0375 12 22.4999 9.53757 22.4999 6.5C22.4999 3.46243 20.0375 1 16.9999 1C15.5754 1 14.2774 1.54153 13.3005 2.42996C14.0593 3.60221 14.4999 4.99966 14.4999 6.5Z"
                        fill="#ffffff"
                      ></path>
                      <path
                        d="M0 18C0 15.7909 1.79086 14 4 14H10C12.2091 14 14 15.7909 14 18V22C14 22.5523 13.5523 23 13 23H1C0.447716 23 0 22.5523 0 22V18Z"
                        fill="#ffffff"
                      ></path>
                      <path
                        d="M16 18V23H23C23.5522 23 24 22.5523 24 22V18C24 15.7909 22.2091 14 20 14H14.4722C15.4222 15.0615 16 16.4633 16 18Z"
                        fill="#ffffff"
                      ></path>
                    </g>
                  </svg>
                  Users
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
