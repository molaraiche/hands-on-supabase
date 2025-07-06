"use client";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.log("error has been happened before login", error.message);
    } else if (data.session) {
      const token = data.session.access_token;
      document.cookie = `token=${token}; path=/`;
      router.push("/");
    }
  };
  return (
    <div>
      <div className="flex items-center justify-center h-[20vh]">
        <h1 className="text-5xl font-bold">Login</h1>
      </div>
      <div className="flex items-center justify-center">
        <form
          onSubmit={handleLogin}
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
              Sign in
            </button>
          </div>
          <div className="">
            <p>
              {" "}
              You don&apos;t have an account ?,{" "}
              <Link href="/register" className="font-bold">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
