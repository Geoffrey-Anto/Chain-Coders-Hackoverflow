import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { trpc } from "../../utils/trpc";

interface Props {
  message?: String;
}

const Dashboard = ({ message }: Props) => {
  const { data, isLoading, refetch } = trpc.useQuery([
    "application.get_applications",
  ]);
  const { mutateAsync: changeStatus } = trpc.useMutation(
    ["application.change_status"],
    {
      onSuccess: () => {
        refetch();
      },
    }
  );
  const { mutateAsync: logoutBank } = trpc.useMutation(["bank.logout"]);
  const router = useRouter();

  useEffect(() => {
    if (message) {
      toast(message as any, {
        position: "top-center",
        duration: 1500,
      });
    }
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-10 w-screen h-screen overflow-hidden">
      <p
        onClick={async () => {
          await logoutBank();
          router.replace("/landing");
        }}
        className="p-2 absolute right-2 top-2 text-lg font-bold cursor-pointer"
      >
        Logout
      </p>
      <Toaster />
      <p className="text-4xl mb-10 font-bold">Applied Users</p>
      <div className="w-full min-h-screen flex flex-row items-start justify-start gap-14 flex-wrap">
        {data?.map((d) => {
          return (
            <div
              key={d.id}
              className="w-64 h-44 rounded-md p-2 border-2 border-black flex flex-row items-start justify-between bg-white text-black"
            >
              <div className="h-full flex flex-col items-start justify-between">
                <div>
                  <p className="text-3xl">{d.User.name}</p>
                  <p className="text-">
                    {d.time.getDate().toString() +
                      "D " +
                      d.time.getMonth().toString() +
                      "M " +
                      d.time.getFullYear().toString() +
                      "Y"}
                  </p>
                </div>
                {d.status === "PENDING" ? (
                  <button
                    onClick={() => {
                      router.push(
                        process.env.NEXT_PUBLIC_VIDEO_CALL_URL as string
                      );
                    }}
                    className="px-4 py-2 border-2 border-black rounded-full hover:bg-blue-400"
                  >
                    Join Call
                  </button>
                ) : d.status === "APPROVED" ? (
                  <button className="px-4 py-2 border-2 border-black rounded-full hover:bg-blue-400">
                    Show KYC
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 border-2 border-black rounded-full bg-gray-400"
                  >
                    REJECTED
                  </button>
                )}
              </div>
              <div className="h-full flex items-end justify-end gap-3 ">
                <p
                  onClick={async () => {
                    changeStatus({
                      bankId: d.bankId,
                      userId: d.userId,
                      status: "PENDING",
                    });
                  }}
                  className={
                    d.status !== "PENDING"
                      ? "text-yellow-500 border-2 border-yellow-500 p-2 rounded-full mb-3 mr-2 cursor-pointer"
                      : "bg-yellow-500 border-2 border-yellow-500 p-2 rounded-full mb-3 mr-2 cursor-pointer"
                  }
                ></p>
                <p
                  onClick={async () => {
                    changeStatus({
                      bankId: d.bankId,
                      userId: d.userId,
                      status: "APPROVED",
                    });
                  }}
                  className={
                    d.status !== "APPROVED"
                      ? "text-green-500 border-2 border-green-500 p-2 rounded-full mb-3 mr-2 cursor-pointer"
                      : "bg-green-500 border-2 border-green-500 p-2 rounded-full mb-3 mr-2 cursor-pointer"
                  }
                ></p>
                <p
                  onClick={async () => {
                    changeStatus({
                      bankId: d.bankId,
                      userId: d.userId,
                      status: "REJECTED",
                    });
                  }}
                  className={
                    d.status !== "REJECTED"
                      ? "text-red-500 border-2 border-red-500 p-2 rounded-full mb-3 mr-2 cursor-pointer"
                      : "bg-red-500 border-2 border-red-500 p-2 rounded-full mb-3 mr-2 cursor-pointer"
                  }
                ></p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

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
    };
  }

  if (isBankTokenAvailable && isUserTokenAvailable) {
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

  if (!isBankTokenAvailable) {
    return {
      redirect: {
        destination: "/auth/login/Bank",
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};

export default Dashboard;
