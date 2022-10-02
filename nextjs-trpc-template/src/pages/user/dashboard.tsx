import { GetServerSideProps } from "next";
import React from "react";
import { trpc } from "../../utils/trpc";
import * as jwt from "jsonwebtoken";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

interface Props {
  message?: String;
}

const Dashboard = ({ message }: Props) => {
  const { data, isLoading, refetch } = trpc.useQuery([
    "bank.getAll",
    {
      take: 9,
    },
  ]);
  const { mutateAsync: applyKYC } = trpc.useMutation(
    ["application.add_application"],
    {
      onSuccess: () => {
        refetch();
      },
    }
  );
  const { mutateAsync: logoutUser } = trpc.useMutation(["user.logout"]);
  const router = useRouter();

  const applicationSubmitHandler = async (bankId: string) => {
    try {
      await applyKYC({
        bankId,
      });
      toast.success("Successfully Applied");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Toaster />
      <p
        onClick={async () => {
          await logoutUser();
          router.replace("/landing");
        }}
        className="p-2 absolute right-2 top-2 text-lg font-bold cursor-pointer"
      >
        Logout
      </p>
      <h1 className="p-6 font-bold text-center m-4 text-3xl">
        Apply For KYC In Banks Across The Country
      </h1>
      <div className="flex justify-center items-center space-x-10 text-center p-2 font__titillium flex-wrap gap-6 ">
        {data?.map((data) => {
          return (
            <div
              key={data.id}
              className={
                data.applications
                  ? data.applications.status === "APPROVED"
                    ? "flex flex-row bg-green-400 p-4 rounded-xl"
                    : data.applications.status === "REJECTED"
                    ? "flex flex-row bg-red-400 p-4 rounded-xl"
                    : "flex flex-row bg-yellow-200 p-4 rounded-xl"
                  : "flex flex-row bg-white p-4 rounded-xl"
              }
            >
              <div className="flex flex-col gap-2">
                <h1 className="p-2 font-bold">Bank Name:{data.name}</h1>
                <h2 className="p-2 font-semibold">
                  Ifsc Code: {data.ifsc_code}
                </h2>
                {!data.applications ? (
                  <button
                    onClick={() => {
                      applicationSubmitHandler(data.id);
                    }}
                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                  >
                    Apply For KYC
                  </button>
                ) : data.applications.status === "PENDING" ? (
                  <button
                    onClick={() => {
                      router.replace(
                        process.env.NEXT_PUBLIC_VIDEO_CALL_URL as string
                      );
                    }}
                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                  >
                    Join Meet
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      // router.replace(
                      //   process.env.NEXT_PUBLIC_VIDEO_CALL_URL as string
                      // );
                    }}
                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                  >
                    Re Apply
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div></div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookies = req.cookies;

  const isBankTokenAvailable: string | undefined = cookies["bank_token"];
  const isUserTokenAvailable: string | undefined = cookies["user_token"];

  if (!isBankTokenAvailable && !isUserTokenAvailable) {
    return {
      redirect: {
        destination: "/landing",
        permanent: false,
      },
      props: {},
    };
  }

  if (isBankTokenAvailable && isUserTokenAvailable) {
    // delete the bank token
    res.setHeader(
      "Set-Cookie",
      `bank_token=; path=/; httpOnly; sameSite=strict; Max-Age=0`
    );

    return {
      props: {
        message: "Continuing as a user",
      },
    };
  }

  if (!isUserTokenAvailable) {
    return {
      redirect: {
        destination: "/auth/login/User",
        permanent: false,
      },
      props: {},
    };
  }

  const payload = jwt.decode(isUserTokenAvailable) as any;

  if (!payload) {
    return {
      redirect: {
        destination: "/auth/login/User",
        permanent: false,
      },
      props: {},
    };
  }

  const kyc_token = cookies["kyc_token"];

  if (!kyc_token) {
    return {
      redirect: {
        destination: "/Kyc/EnterDetails",
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};

export default Dashboard;
