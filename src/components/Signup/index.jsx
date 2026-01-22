import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import { supabase } from "../supabase";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const navigate = useNavigate();

  const onChangeName = () => {
    if (fullName === "") {
      toast.error("Please Enter Your Name", { autoClose: 1000 });
    }
  };

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

  const addNewUser = async () => {
    try {
      const newUser = {
        name: fullName,
        email: email,
        password: password,
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      };
      const response = await fetch("https://backend-api-tester-t8sp.onrender.com/signup", options);
      const json = await response.json();
      if (response.ok) {
        setIsLoading(false);
        navigate("/login");
        toast.success(`User created successfully. Login to Your Account`, {
          autoClose: 1500,
        });
      } else if (json.status === 403) {
        setIsLoading(false);
        toast.error(json.error, { autoClose: 1800 });
      } else {
        setIsLoading(false);
        toast.error(json.error, { autoClose: 1800 });
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error, { autoClose: 1800 });
    }
  };

  const onSignUp = (event) => {
    event.preventDefault();
    if (fullName !== "" && email !== "" && password !== "") {
      setFullName("");
      setEmail("");
      setPassword("");
      setIsLoading(true);
      addNewUser();
    } else {
      toast.error("Please provide your details", { autoClose: 1200 });
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      await signUpWithGoogle();
      setIsGoogleLoading(false);
    } catch (err) {
      setIsGoogleLoading(false);
      toast.error(`${err}`, { autoClose: 1200 });
    }
  };

  const signUpWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      return data;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    const processUser = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) return;
      const user = session.user;
      addGoogleUser(user);
    };

    processUser();
  }, []);

  const addGoogleUser = async (user) => {
    const newUser = {
      id: user.id,
      email: user.email,
      name: user.user_metadata.full_name,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    };
    const response = await fetch("https://backend-api-tester-t8sp.onrender.com/auth/google", options);
    const json = await response.json();
    if (response.ok) {
      navigate("/");
    } else {
      toast.error(json.error, { autoClose: 1200 });
    }
  };

  return (
    <div className="bg-[url('https://media.istockphoto.com/id/1448952254/vector/application-programming-interface-concept.jpg?s=612x612&w=0&k=20&c=bOL9Qbu9K09iAPQOmm_IoMJvA-6GI-iC59r-nAc2SJU=')] bg-cover bg-center h-screen flex justify-evenly items-center">
      <div className="px-7 hidden md:block rounded-lg w-125 h-70 flex flex-col items-center justify-center">
        <h1 className="text-3xl text-orange-500 font-bold tracking-wider text-center mb-5 underline">
          Test API
        </h1>
        <h1 className="text-2xl text-purple-100 font-semibold tracking-wide text-center mt-0">
          Wanna test whether your{" "}
          <span className="text-orange-400 font-mono font-semibold hover:text-orange-500 hover:font-bold hover:[text-shadow:0_0_12px_rgba(255,165,0,3)] transition">
            API
          </span>{" "}
          is working or not?
        </h1>
        <h1 className="text-xl text-blue-200 mt-2 font-bold tracking-wide text-center">
          Then create an Account and continue...!
        </h1>
        <p className="text-center text-md font-medium mt-3">
          Test your API's by using different Methods like...
          <br />
          <span className="text-orange-500 text-lg">Get</span>,{" "}
          <span className="text-orange-500 text-lg">Post</span>,{" "}
          <span className="text-orange-500 text-lg">Put</span> and{" "}
          <span className="text-orange-500 text-lg">Delete</span>
        </p>
      </div>
      <div className="bg-white/6 border-white/10 border-2 shadow-2xl rounded-2xl h-125 w-100 md:w-110 px-8 py-5 flex flex-col md:items-center">
        <form onSubmit={onSignUp}>
          <h2 className="text-white text-center font-semibold text-3xl mb-3 underline decoration-2">
            Create an Account
          </h2>
          <div className="mb-3">
            <label className="text-white text-lg font-medium">Full Name</label>
            <br />
            <input
              className="w-full md:w-80 text-white text-sm tracking-wide font-semibold border-1 shadow-sm h-10 py-4 px-2 placeholder-slate-300 focus:bg-black/10 rounded-md focus:outline-none"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              onBlur={onChangeName}
            />
          </div>
          <div className="mb-3">
            <label className="text-white text-lg font-medium">Email</label>
            <br />
            <input
              className="w-full md:w-80 text-white text-sm tracking-wide font-semibold border-1 shadow-sm h-10 py-4 px-2 placeholder-slate-300 focus:bg-black/10 rounded-md focus:outline-none"
              type="email"
              placeholder="Enter Your Email"
              value={email}
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={onChangePassword}
            />
          </div>
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="shadow-4xl flex justify-center bg-white/15 font-semibold px-3 py-2 rounded-lg w-30 text-lg text-white active:scale-85 hover:bg-black/10 hover:border-1 transition cursor-pointer active:shadow-gray-500 active:shadow-md"
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
                <p>Signup</p>
              )}
            </button>
          </div>
          <div className="flex justify-center items-center">
            <p className="text-center text-white font-medium">
              Already have Account?
            </p>
            <Link
              to="/login"
              className="px-3 py-1 rounded-md text-lime-200 underline font-medium hover:text-lime-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition"
            >
              Login
            </Link>
          </div>
          <p className="text-center text-lg text-white font-medium mb-2">or</p>
        </form>
        <button
          type="button"
          onClick={handleGoogleSignup}
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
              Signup with Google
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Signup;
