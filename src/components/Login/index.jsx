import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import { supabase } from "../supabase.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const onChangeEmail = () => {
    if (email === "") {
      toast.error("Please Enter Your Email", { autoClose: 1000 });
    }
  };
  const onChangePassword = () => {
    if (password === "") {
      toast.error("Please Enter Your Password", { autoClose: 1000 });
    }
  };
  const onLogin = (event) => {
    event.preventDefault();

    if (email !== "" && password !== "") {
      setIsLoading(true);
      setEmail("");
      setPassword("");
      userLogin();
    } else {
      toast.error("Please Provide Your Details", { autoClose: 1000 });
    }
  };
  const userLogin = async () => {
    try {
      const userData = {
        email: email,
        password: password,
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      };
      const response = await fetch("https://backend-api-tester-t8sp.onrender.com/login", options);
      const json = await response.json();
      setIsLoading(false);
      if (response.ok) {
        const session = await supabase.auth.setSession({
          access_token: json.access_token,
          refresh_token: json.refresh_token,
        });
        navigate("/");
      } else {
        toast.error(json.message, { autoClose: 1500 });
      }
    } catch (error) {
      toast.error(error, { autoClose: 1800 });
    }
  };
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await LoginWithGoogle();
      setIsGoogleLoading(false);
    } catch (error) {
      toast.error(error, { autoClose: 1200 });
    }
  };
  const LoginWithGoogle = async () => {
    try {
      const signupResult = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      return signupResult;
    } catch (error) {
      return error;
    }
  };

  return (
    <div className="bg-[url('https://media.istockphoto.com/id/1448952254/vector/application-programming-interface-concept.jpg?s=612x612&w=0&k=20&c=bOL9Qbu9K09iAPQOmm_IoMJvA-6GI-iC59r-nAc2SJU=')] bg-cover bg-center h-screen flex justify-evenly items-center px-6">
      <div className="px-7 hidden md:block rounded-lg w-125 h-70 flex flex-col items-center justify-center">
        <h1 className="text-4xl text-purple-200 font-semibold tracking-wider text-center font-serif">
          Start Login to test your{" "}
          <span className="text-orange-400 font-mono font-semibold hover:text-orange-500 hover:font-bold hover:[text-shadow:0_0_12px_rgba(255,165,0,3)] transition">
            API
          </span>
          's
        </h1>
        <p className="text-lg text-white font-semibold tracking-wide text-center mt-4">
          Confirm your API is working fine and
          <br />
          Reduce errors in your code
        </p>
      </div>
      <form
        onSubmit={onLogin}
        className="bg-white/5 border-white/10 shadow-2xl rounded-2xl h-110 w-95 md:w-100 px-8 py-5 flex flex-col md:items-center"
      >
        <h2 className="text-white text-center font-semibold text-3xl mb-3 underline decoration-2">
          Login
        </h2>
        <div className="mb-3">
          <label className="text-white text-lg font-medium">Email</label>
          <br />
          <input
            className="w-full md:w-80 text-white text-sm tracking-wide font-semibold border-1 shadow-sm h-10 py-4 px-2 placeholder-slate-300 focus:bg-black/10 rounded-md focus:outline-none"
            type="email"
            placeholder="Enter Your Email"
            onChange={(event) => setEmail(event.target.value)}
            onBlur={onChangeEmail}
          />
        </div>
        <div className="mb-3">
          <label className="text-white text-lg font-medium">Password</label>
          <br />
          <input
            className="w-full md:w-80 text-white text-sm tracking-wide font-semibold border-1 shadow-sm h-10 py-4 px-2 placeholder-slate-300 rounded-md focus:outline-none focus:bg-black/10"
            type="password"
            placeholder="Enter Your Password"
            onChange={(event) => setPassword(event.target.value)}
            onBlur={onChangePassword}
          />
        </div>
        <div className="flex justify-center items-center">
          <button
            type="submit"
            className="shadow-4xl flex justify-center bg-white/15 font-bold px-3 py-2 rounded-lg w-30 text-lg text-white active:scale-85 hover:bg-black/10 hover:border-1 transition cursor-pointer active:shadow-gray-500 active:shadow-md"
          >
            {isLoading ? (
              <TailSpin
                height="30"
                width="30"
                color="white"
                ariaLabel="tail-spin-loading"
                visible={isLoading}
              />
            ) : (
              "Login"
            )}
          </button>
        </div>
        <div className="flex justify-center items-center">
          <p className="text-center text-white font-medium">
            Don't have account?
          </p>
          <Link
            to="/signup"
            className="px-3 py-1 rounded-md text-lime-200 underline font-medium hover:text-lime-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition"
          >
            Signup
          </Link>
        </div>
        <p className="text-center text-lg text-white font-medium mb-2">or</p>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex justify-center items-center self-center text-lg bg-white/15 font-medium gap-1 py-2 w-60 rounded-md hover:bg-black/10 hover:border-1 active:scale-85 transition cursor-pointer active:shadow-gray-500 active:shadow-md"
        >
          {isGoogleLoading ? (
            <TailSpin
              height="30"
              width="30"
              color="white"
              ariaLabel="tail-spin-loading"
              visible={isGoogleLoading}
            />
          ) : (
            <>
              <FcGoogle className="text-xl mt-1" />
              Login with Google
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
