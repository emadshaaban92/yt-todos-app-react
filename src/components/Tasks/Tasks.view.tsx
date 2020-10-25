import React, { Fragment, useState } from "react";
import * as E from 'fp-ts/Either'
import { pipe } from "fp-ts/lib/function";
import * as t from 'io-ts';

import TaskSearchBar from "../TaskSearchBar/TaskSearchBar.view";
import TaskList from "../TaskList/TaskList.view";
import { fetchTasks, saveToDB } from "../../helpers";


const Task = t.type({
  id: t.number,
  value: t.string,
  done: t.boolean
});

export type Task = t.TypeOf<typeof Task>;

type Props = {
  hideCompletedTasksFlag: boolean;
  toggleCompletedTasks: () => void
}

const Tasks = ({ hideCompletedTasksFlag, toggleCompletedTasks }: Props) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loading || saveToDB("tasks", tasks);
  }, [loading, tasks]);

  React.useEffect(() => {
    pipe(
      fetchTasks(),
      t.array(Task).decode,
      E.fold(
        errors => {
          console.error(errors);
          setTasks([]);
        },
        tasks => {
          setTasks(tasks);
          setLoading(false)
        }
      )
    )
  }, []);


  const addTask = (inputValue: string) => setTasks((prevState: Task[]) => [
    ...prevState,
    {
      id: new Date().getTime(),
      value: inputValue,
      done: false,
    },
  ])

  const updateTask = (taskValue: string, taskID: number) => setTasks(
    tasks.map((task) =>
      task.id === taskID ? { ...task, value: taskValue } : task
    )
  );

  const removeTask = (taskID: number) => setTasks(
    tasks.filter((task) => {
      return task.id !== taskID;
    })
  );

  const toggleTask = (taskID: number) => setTasks(
    tasks.map((task) =>
      task.id === taskID ? { ...task, done: !task.done } : task
    )
  );

  return (
    <Fragment>
      <TaskSearchBar addTask={addTask} />
      <TaskList
        tasks={tasks}
        updateTask={updateTask}
        removeTask={removeTask}
        toggleTask={toggleTask}
        hideCompletedTasksFlag={hideCompletedTasksFlag}
        toggleCompletedTasks={toggleCompletedTasks}
      />
    </Fragment>
  );
};

export default Tasks;
