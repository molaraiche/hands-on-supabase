"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
type Task = {
  id: number;
  task: string;
  created_at: string;
};

const TasksRealtime = ({ initialTasks }: { initialTasks: Task[] }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectTask, setSelectTask] = useState(0);
  const [updatedTask, setUpdatedTask] = useState("");
  const [menu, setMenu] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  useEffect(() => {
    // Subscribe to realtime changes
    const channel = supabase
      .channel("tasks")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "tasks" },
        (payload) => {
          setTasks((current: any) => [...current, payload.new]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "tasks" },
        (payload) => {
          setTasks((current: any) =>
            current.map((task: any) =>
              task.id === payload.new.id ? payload.new : task
            )
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "tasks" },
        (payload) => {
          setTasks((current) =>
            current.filter((task) => task.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
  const editHandler = (id: number, taskText: string) => {
    setMenu(true);
    setSelectTask(id);
    setUpdatedTask(taskText);
  };
  const updateHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!updatedTask.trim()) return; // prevent empty update

    const { error } = await supabase
      .from("tasks")
      .update({ task: updatedTask })
      .eq("id", selectTask);

    if (error) {
      console.error("Failed to update task:", error.message);
      return;
    }

    setMenu(false);
    setUpdatedTask("");
    setSelectTask(0);
  };
  const deleteHandler = async (id: any) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete task:", error.message);
      return;
    }
  };
  const logoutHandler = async (e: React.MouseEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signOut();

    // Manually clear cookie if you're storing token in cookies
    document.cookie = "supabase-auth-token=; Max-Age=0; path=/;";

    if (error) {
      console.log("Error during signout:", error.message);
    } else {
      console.log("Signout successful");

      // Refresh UI
      router.push("/login");
      // or force reload if middleware still caches session
      // window.location.href = "/login";
    }
  };

  return (
    <>
      {tasks.length === 0 ? (
        <div className="flex items-center justify-center h-[40vh] text-3xl font-bold uppercase">
          <p>Please Write a task first</p>
        </div>
      ) : (
        <ul className="min-h-[40vh] flex flex-col gap-3 items-center justify-center">
          {tasks?.map((task) => (
            <li
              key={task.id}
              className="bg-black w-[40%] flex items-center justify-between h-16 px-5 rounded"
            >
              <span className="text-white">{task.task} </span>
              <span className="flex items-center gap-3">
                <span
                  className="py-2.5 px-4 text-white bg-green-500 rounded hover:opacity-90 cursor-pointer"
                  onClick={() => editHandler(task.id, task.task)}
                >
                  {" "}
                  Edit{" "}
                </span>
                <span
                  className="py-2.5 px-4 text-white bg-red-500 rounded hover:opacity-90 cursor-pointer"
                  onClick={() => deleteHandler(task.id)}
                >
                  Delete
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
      <div
        className={`${
          menu ? "flex" : "hidden"
        } bg-[#222] text-white w-[600px] h-[300px] items-center justify-center absolute top-[50%] left-[50%] -translate-x-[50%] rounded`}
      >
        <form
          onSubmit={updateHandler}
          className="h-[20vh] flex items-center w-full flex-col justify-center gap-3"
        >
          <div className="flex justify-end w-full pr-10">
            <span className="w-10 h-10 flex items-center rounded justify-center bg-white text-black font-bold">
              X
            </span>
          </div>
          <input
            type="text"
            placeholder="Old Task"
            className="p-2.5 outline-none border border-gray-200 focus:border-black focus:border rounded font-medium"
            readOnly
            value={selectTask}
          />
          <input
            type="text"
            placeholder="Write the updated Task"
            className="p-2.5 outline-none border border-gray-200 focus:border-black focus:border rounded font-medium"
            value={updatedTask}
            onChange={(e) => setUpdatedTask(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-black text-white font-semibold py-2.5 px-4 rounded hover:opacity-80 cursor-pointer ease-in-out duration-200"
            >
              Edit
            </button>
            <button
              type="submit"
              className="bg-white text-black font-semibold py-2.5 px-4 rounded hover:opacity-80 cursor-pointer ease-in-out duration-200"
              onClick={() => setMenu(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <div className="flex items-center justify-end px-10">
        <button
          className="py-2.5 px-6 bg-red-500 font-semibold text-white"
          onClick={logoutHandler}
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default TasksRealtime;
