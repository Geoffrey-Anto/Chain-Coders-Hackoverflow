import type { GetServerSideProps, NextPage } from "next";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data, isLoading, refetch } = trpc.useQuery(["user.getAll", {}]);

  const { mutateAsync } = trpc.useMutation("user.login", {
    onSuccess: () => {
      refetch();
    },
  });

  const login = async () => {
    const res = await mutateAsync({
      email: "johndoe3@gmail.com",
      password: "123456789",
    });

    console.log(res);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full min-h-screen p-20 flex items-center justify-center bg-black text-white">
      {data ? (
        data?.map((user) => (
          <div key={user.id} className="p-12 border-2 border-white w-fit">
            <p className="mb-4 text-3xl text-center">USER</p>
            <div>{user.name}</div>
            <div>{user.email}</div>
            <div>{user.createdAt.toUTCString()}</div>
          </div>
        ))
      ) : (
        <div onClick={login}>LOGIN</div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
    redirect: {
      destination: "/landing",
    },
  };
};

export default Home;
