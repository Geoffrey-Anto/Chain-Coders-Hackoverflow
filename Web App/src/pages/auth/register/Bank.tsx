import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import styles from "../../../../styles/userlogin.module.css";
import { trpc } from "../../../utils/trpc";
import { GetServerSideProps } from "next";

interface UserLoginInput {
  email: string;
  password: string;
  name: string;
  Ifsc: string;
}

const InitialUserData = {
  email: "",
  password: "",
  name: "",
  Ifsc: "",
};

const BankRegister = () => {
  const [user, setUser] = useState<UserLoginInput>(InitialUserData);
  const { mutateAsync: registerBank } = trpc.useMutation(["bank.register"]);
  const router = useRouter();

  const onSubmitHandler = async (
    e: React.MouseEvent<HTMLFormElement, MouseEvent>
  ) => {
    e.preventDefault();

    try {
      await registerBank({
        email: user.email,
        password: user.password,
        name: user.name,
        ifsc_code: user.Ifsc,
      });

      toast.success("Registration Successful");

      router.replace("/auth/login/Bank");
    } catch (error: any) {
      toast.error(error.message, {
        position: "top-center",
        duration: 2000,
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen items-center justify-center p-4 flex-wrap">
      <div className="flex flex-col text-center mt-6 w-full max-w-sm">
        <h1 className="font-bold text-5xl md:text-7xl text-white tracking-widest gap-9">
          KYEASY
        </h1>
        <br></br>
        <p className="font-semibold text-xl text-white">
          We will help you to ease down your KYC Process
        </p>
      </div>
      <form
        onSubmit={onSubmitHandler}
        className={
          "w-full h-full flex flex-col items-center justify-around mt-14 bg-blue-500 p-2 rounded-lg max-w-sm"
        }
      >
        <h1 className="font-bold text-3xl py-3 text-white mb-1">
          REGISTER BANK
        </h1>
        <input
          type="text"
          className={styles.input}
          placeholder="Enter Your Name"
          onChange={(e) => {
            setUser({ ...user, name: e.target.value });
          }}
        />
        <br></br>
        <input
          type="text"
          className={styles.input}
          placeholder="Enter Your Bank IFSC CODE "
          onChange={(e) => {
            setUser({ ...user, Ifsc: e.target.value });
          }}
        />
        <br></br>
        <input
          type="email"
          className={styles.input}
          placeholder="Enter Your Email"
          onChange={(e) => {
            setUser({ ...user, email: e.target.value });
          }}
        />
        <br></br>
        <input
          type="password"
          className={styles.input}
          placeholder="Enter Your Password"
          onChange={(e) => {
            setUser({ ...user, password: e.target.value });
          }}
        />
        <br></br>
        <button
          type="submit"
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookies = req.cookies;

  if (cookies["bank_token"] && cookies["user_token"]) {
    // delete the user token
    res.setHeader(
      "Set-Cookie",
      `user_token=; path=/; httpOnly; sameSite=strict; Max-Age=0`
    );

    return {
      props: {
        message: "Continuing as a bank",
      },
    };
  }

  if (cookies["bank_token"]) {
    return {
      redirect: {
        destination: "/bank/dashboard",
        permanent: false,
      },
    };
  }

  if (cookies["user_token"]) {
    return {
      redirect: {
        destination: "/user/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default BankRegister;
