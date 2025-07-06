"use client";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useState } from "react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const supabase = createClient();
  const registerHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("Registration error:", error.message);
    } else {
      console.log("User registered:", data);
    }
  };
  return (
    <div>
      <div className="flex items-center justify-center h-[20vh]">
        <h1 className="text-5xl font-bold">Register</h1>
      </div>
      <div className="flex items-center justify-center">
        <form
          onSubmit={registerHandler}
          className="bg-black text-white w-[800px] h-[500px] flex items-center justify-center flex-col  rounded"
        >
          <div className="flex flex-col w-[60%]">
            <label htmlFor="" className="my-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              className="h-[35px] px-1 border border-gray-500 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-[60%]">
            <label htmlFor="" className="my-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              className="h-[35px] px-1 border border-gray-500 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="my-3">
            <button
              type="submit"
              className="py-2.5 px-6 bg-white text-black rounded cursor-pointer font-semibold"
            >
              Sign up
            </button>
          </div>
          <div className="">
            <p>
              {" "}
              You already have an account ?,{" "}
              <Link href="/login" className="font-bold">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
