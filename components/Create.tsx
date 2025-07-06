"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

type formType = {
  input: string;
};
const Create = () => {
  const [task, setTask] = useState("");
  const supabase = createClient();

  const taskHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task) {
      alert("add task first");
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      alert("User not logged in");
      return;
    }

    const { data, error } = await supabase.from("tasks").insert({
      task: task,
      user_id: userData.user.id,
    });

    if (error) {
      console.error("Insert error:", error);
      alert("Failed to create task");
    } else {
      console.log("Task created:", data);
      setTask("");
    }
  };

  return (
    <form
      onSubmit={taskHandler}
      className="h-[20vh] flex items-center justify-center gap-3"
    >
      <input
        type="text"
        placeholder="Wrtie new task"
        className="p-2.5 outline-none border border-gray-200 focus:border-black focus:border rounded font-medium"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button
        type="submit"
        className="bg-black text-white font-semibold py-2.5 px-4 rounded hover:opacity-80 cursor-pointer ease-in-out duration-200"
      >
        Add
      </button>
    </form>
  );
};

export default Create;
