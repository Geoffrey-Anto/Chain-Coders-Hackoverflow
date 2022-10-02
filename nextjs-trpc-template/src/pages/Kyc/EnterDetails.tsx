import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import styles from "../../../styles/Form.module.css";
import { trpc } from "../../utils/trpc";
import { auth, firebase } from "../../utils/firebase";
import { GetServerSideProps } from "next";
import { Waveform } from "@uiball/loaders";

const InitialUserData = {
  aadharId: "",
  panId: "",
  passport: "",
  driverLicenseId: "",
};

const UserLogin = () => {
  const [user, setUser] = useState(InitialUserData);
  const [image, setImage] = useState<string>(
    "https://lh3.googleusercontent.com/drive-viewer/AJc5JmSCftLh_9-7WMjCTO8bsbXnUF8DU3k02knUAt9P3bMOCl1xjnNonnZJTv3p8gulnGIeTaRWUQI=w1920-h955"
  );
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationOBJ, setConfimationOBJ] =
    useState<firebase.auth.ConfirmationResult | null>(null);
  const { mutateAsync: createToken } = trpc.useMutation(["kyc.create_token"]);
  const { mutateAsync: getOCR, isLoading } = trpc.useMutation([
    "kyc.isAadharVerified",
  ]);
  const { mutateAsync: createKYC } = trpc.useMutation(["kyc.create"]);
  const [OCRText, setOCRText] = useState("");
  const router = useRouter();

  function isCharNumber(c: any) {
    return c >= "0" && c <= "9";
  }

  const getNumber = (text: string) => {
    let str = "";
    for (let i = 0; i < text.length; i++) {
      if (isCharNumber(text[i])) {
        str += text[i];
      }
    }

    return str;
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(
      getNumber(
        OCRText.split("I")[2]
          .substring(6, OCRText.split("I")[2].length)
          .toString()
      )
    );
    try {
      if (
        getNumber(
          OCRText.split("I")[2]
            .substring(6, OCRText.split("I")[2].length)
            .toString()
        ) !== user.aadharId
      ) {
        toast.error("Please Enter Correct ID");
        return;
      }

      const response = await createKYC(user);

      if (response) {
        toast.success("KYC created successfully");

        signin();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }

    console.log(user);
  };

  const signin = () => {
    if (mobileNumber === "" || mobileNumber.length <= 10) return;

    let verify = new firebase.auth.RecaptchaVerifier("recaptcha-container");
    auth
      .signInWithPhoneNumber(mobileNumber, verify)
      .then((result) => {
        setConfimationOBJ(result);
        setIsOtpSent(true);
      })
      .catch((err) => {
        alert(err);
        window.location.reload();
      });
  };

  const ValidateOtp = () => {
    if (otp === null || confirmationOBJ === null) return;
    confirmationOBJ
      .confirm(otp)
      .then(async (result) => {
        await createToken();
        router.replace("/user/dashboard");
      })
      .catch((err) => {
        alert("Wrong code");
      });
  };

  // function encodeImageFileAsURL(element: ChangeEvent<HTMLInputElement>) {
  //   if (element.target.files) {
  //     try {
  //       var file = element?.target?.files[0] as File;
  //       new Compressor(file, {
  //         quality: 0.6,
  //         success(file_) {
  //           var reader = new FileReader();
  //           reader.onloadend = function () {
  //             setImage(reader.result as string);
  //             x();
  //           };
  //           reader.readAsDataURL(file_);
  //         },
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   } else {
  //     setImage("");
  //   }
  // }

  const x = async () => {
    if (!image) return;
    const res = await getOCR({
      frontImage: image,
    });

    setOCRText(res.value);
  };

  //   async function handleWidgetClick() {
  //     const widget = window.cloudinary.createUploadWidget(
  //       {
  //         cloudName: "projectcloudat7",
  //         uploadSignature: 'at7_upload_preset',
  //         apiKey: 844666871246736,
  //         resourceType: "image",
  //       },
  //       (error, result) => {
  //         if (!error && result && result.event === "success") {
  //           console.log("Done! Here is the image info: ", result.info);
  //           setIsImageUploaded(true);
  //         } else if (error) {
  //           console.log(error);
  //         }
  //       }
  //     );
  //     widget.open();
  //   }

  return (
    <>
      <Toaster />
      <div className="flex flex-col md:flex-col min-h-screen items-center justify-center p-12 flex-wrap w-full">
        <form
          onSubmit={onSubmitHandler}
          className={
            "w-full h-full flex flex-col items-center justify-around bg-blue-500 p-6 rounded-lg max-w-xl"
          }
        >
          {!isOtpSent ? (
            <>
              <h1 className="font-bold text-3xl py-3 text-white mb-8 text-center">
                Upload Your KYC Documents
              </h1>

              <input
                type="text"
                className={styles.input}
                placeholder="Enter Your Aadhar Number"
                onChange={(e) => {
                  setUser({ ...user, aadharId: e.target.value });
                }}
              />
              <br></br>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter Your Driving License No"
                onChange={(e) => {
                  setUser({ ...user, driverLicenseId: e.target.value });
                }}
              />
              <br></br>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter Your Pan Number"
                onChange={(e) => {
                  setUser({ ...user, panId: e.target.value });
                }}
              />
              <br></br>

              <input
                type="text"
                className={styles.input}
                placeholder="Enter Your Passport Number"
                onChange={(e) => {
                  setUser({ ...user, passport: e.target.value });
                }}
              />
              <br></br>

              <input
                type="text"
                className={styles.input}
                placeholder="Enter Your Mobile Number"
                onChange={(e) => {
                  setMobileNumber(e.target.value);
                }}
              />

              <br></br>

              <div className="w-full text-center flex flex-col items-center justify-center">
                <input
                  type={"text"}
                  className={styles.input}
                  onChange={(e) => {
                    setImage(e.target.value);
                    x();
                  }}
                  placeholder="Aadhar Card Image"
                />
                <br />
                {isLoading ? (
                  <Waveform
                    size={40}
                    lineWeight={3.5}
                    speed={1}
                    color="black"
                  />
                ) : (
                  <div>
                    {OCRText.split("I")
                      .slice(0, 2)
                      .map((text) => {
                        return <p className="text-sm mt-1">{text}</p>;
                      })}
                    <p>
                      {/* {OCRText?.split("I")[2]?.substring(
                        6,
                        OCRText?.split("I")[2]?.length
                      )} */}
                      XXXX XXXX XXXX
                    </p>
                  </div>
                )}
              </div>
              <br />

              <button
                type="submit"
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-10 border border-gray-400 rounded shadow"
              >
                Submit
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-center flex-col">
              <h1 className="font-bold text-3xl py-3 text-white mb-8 text-center">
                ENTER THE OTP
              </h1>

              <input
                type="text"
                className={styles.input}
                placeholder="Enter The OTP"
                onChange={(e) => {
                  setOtp(e.target.value);
                }}
              />

              <button
                onClick={(e) => {
                  e.preventDefault();
                  ValidateOtp();
                }}
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-10 border mt-7 border-gray-400 rounded shadow"
              >
                Submit
              </button>
            </div>
          )}
        </form>
        <div id="recaptcha-container"></div>
        {/* <button
          type="submit"
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 my-2 border border-gray-400 rounded shadow"
          //   onClick={() => handleWidgetClick()}
        >
          Upload files
        </button> */}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookies = req.cookies;

  const kyc_token = cookies["kyc_token"];

  if (kyc_token) {
    return {
      props: {},
      redirect: {
        destination: "/user/dashboard",
      },
    };
  }

  return {
    props: {},
  };
};

export default UserLogin;
