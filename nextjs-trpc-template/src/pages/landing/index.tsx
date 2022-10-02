import Link from "next/link";
import React from "react";

import styles from "../../../styles/landing.module.css";
const Landing = () => {
  return (
    <>
      <nav className="flex items-center justify-between flex-wrap bg-white titillium__web font-bold italic">
        <div className="flex items-center flex-shrink-2 text-white mr-6 titillium__web">
          <img src="logo4.jpg" className="navbar_png py-2 px-2"></img>
        </div>
        <div className="block lg:hidden">
          <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
            <svg
              className="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow flex flex-row gap-x-5">
            <Link
              href="/auth/login/User"
              className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-blue-400 mr-4"
            >
              <p className=" w-fit h-fit cursor-pointer">Login for User</p>
            </Link>
            <Link
              href="/auth/register/User"
              className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-blue-400 mr-4"
            >
              <p className=" w-fit h-fit cursor-pointer">Register for User</p>
            </Link>
            <Link
              href="/auth/login/Bank"
              className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-blue-400 mr-4"
            >
              <p className=" w-fit h-fit cursor-pointer">Login for Bank</p>
            </Link>
            <Link
              href="/auth/register/Bank"
              className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-blue-400"
            >
              <p className=" w-fit h-fit cursor-pointer">Register for Bank</p>
            </Link>
          </div>
        </div>
      </nav>

      <div className={styles.main_div}>
        <h1 className={styles.head_1}>Get Your KYC Done!</h1>
        <h3 className={styles.head_3}>
          As You Can Now Do It With The Comfort of your couch
        </h3>
        <div></div>
        <img
          className={styles.main_img}
          src="landinggraphic.png"
          alt="Kyc Png"
        ></img>
      </div>
    </>
  );
};

export default Landing;
