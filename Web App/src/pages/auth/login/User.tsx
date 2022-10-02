import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import styles from "../../../../styles/userlogin.module.css";
import { trpc } from "../../../utils/trpc";

interface UserLoginInput {
  email: string;
  password: string;
}

const InitialUserData = {
  email: "",
  password: "",
};

const UserLogin = () => {
  const [user, setUser] = useState<UserLoginInput>(InitialUserData);
  const { mutateAsync: loginUser } = trpc.useMutation(["user.login"]);
  const router = useRouter();

  const onSubmitHandler = async (
    e: React.MouseEvent<HTMLFormElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (
      user &&
      user.email &&
      user.password &&
      user.email.length > 5 &&
      user.password.length > 6
    ) {
      try {
        await loginUser({
          email: user.email,
          password: user.password,
        });
        toast.success("Login Successful");

        router.replace("/user/dashboard");
      } catch (error: any) {
        toast.error(error.message, {
          position: "top-center",
          duration: 2000,
        });
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen items-center justify-center p-4 flex-wrap">
      <Toaster />
      <div className="flex flex-col text-center mt-6 w-full max-w-sm">
        <h1 className="font-bold text-5xl md:text-7xl text-white tracking-widest">
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
        <h1 className="font-bold text-3xl py-3 text-white mb-1">USER LOGIN</h1>

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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookie = req.cookies;

  const userToken: string | undefined = cookie["user_token"];

  if (userToken) {
    return {
      props: {},
      redirect: {
        destination: "/user/dashboard",
        statusCode: 302,
      },
    };
  }

  const bankToken: string | undefined = cookie["bank_token"];

  if (bankToken) {
    return {
      props: {},
      redirect: {
        destination: "/bank/dashboard",
        statusCode: 302,
      },
    };
  }

  return {
    props: {},
  };
};

export default UserLogin;
