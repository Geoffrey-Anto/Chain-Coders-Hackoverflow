import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { toast, Toaster } from "react-hot-toast";
import styles from "../../../../styles/userlogin.module.css";
import { trpc } from "../../../utils/trpc";

interface BankLoginInput {
  ifsc_code: string;
  password: string;
}

const InitialBankData = {
  ifsc_code: "",
  password: "",
};

const BankLogin = () => {
  const [bank, setBank] = React.useState<BankLoginInput>(InitialBankData);
  const { mutateAsync: loginBank } = trpc.useMutation("bank.login");
  const router = useRouter();

  const onSubmitHandler = async (
    e: React.MouseEvent<HTMLFormElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (
      bank &&
      bank.ifsc_code &&
      bank.password &&
      bank.ifsc_code.length > 5 &&
      bank.password.length > 6
    ) {
      try {
        await loginBank({
          ifsc_code: bank.ifsc_code,
          password: bank.password,
        });

        toast.success("Login Successful");

        router.replace("/bank/dashboard");
      } catch (error: any) {
        console.log(error.message);
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
        <h1 className="font-bold text-3xl py-3 text-white mb-1">BANK LOGIN</h1>
        <input
          type="ifsc_code"
          className={styles.input}
          placeholder="Enter Your ifsc_code"
          onChange={(e) => {
            setBank({ ...bank, ifsc_code: e.target.value });
          }}
        />
        <br></br>
        <input
          type="password"
          className={styles.input}
          placeholder="Enter Your Password"
          onChange={(e) => {
            setBank({ ...bank, password: e.target.value });
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

  const userToken: string | undefined = cookie["user_token"];

  if (userToken) {
    return {
      props: {
        message: "Continuing as a user",
      },
      redirect: {
        destination: "/user/dashboard",
        statusCode: 302,
      },
    };
  }

  return {
    props: {},
  };
};

export default BankLogin;
