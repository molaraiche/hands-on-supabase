import Create from "@/components/Create";
import TasksRealtime from "@/components/TasksRealtime";
import { createClient } from "@/utils/supabase/server";
const App = async () => {
  const supabase = await createClient();
  const { data } = await supabase.from("tasks").select();
  return (
    <main className="relative">
      <div className="h-[10vh] flex items-center justify-center font-bold text-5xl uppercase">
        <h1>Todo APP</h1>
      </div>
      <Create />
      <TasksRealtime initialTasks={data || []} />

   
    </main>
  );
};

export default App;
