import React, { useState } from "react";
import * as O from 'fp-ts/Option';
import { pipe } from "fp-ts/lib/function";

import checkmarkIcon from "../../assets/icon-checkmark.svg";
import basketIcon from "../../assets/icon-basket.svg";
import EmptyList from "../EmptyList/EmptyList.view";
import type { Task } from "../Tasks/Tasks.view";
import "./TaskList.style.scss";

type Props = {
  tasks: Task[];
  updateTask: (taskValue: string, taskID: number) => void;
  removeTask: (taskID: number) => void;
  toggleTask: (taskID: number) => void;
  hideCompletedTasksFlag: boolean;
  toggleCompletedTasks: () => void;
};
const TaskList = ({ tasks, updateTask, removeTask, toggleTask, hideCompletedTasksFlag, toggleCompletedTasks }: Props) => {
  const [editModeID, setEditModeID] = useState<O.Option<number>>(O.none);

  const onRemoveTask = (taskID: number, shouldConfirm: boolean = true) => {
    if (shouldConfirm) {
      const result = window.confirm(
        "سيتم حذف هذه المهمه نهائيا, هل أنت متأكد؟"
      );

      if (!result) {
        return false;
      }
    }
    removeTask(taskID)
  };

  const onKeyDown = (taskValue: string, taskID: number) => {
    setEditModeID(O.none);

    if (!taskValue.trim()) {
      onRemoveTask(taskID, hideCompletedTasksFlag);
    }
  };

  const generateTaskClasses = (done: boolean) =>
    `TaskList__taskContent ${done ? "TaskList__taskContent--isActive" : ""}`;

  const generateLinkClasses = `TaskList__link ${hideCompletedTasksFlag ? "TaskList__link--isActive" : ""
    }`;

  const exitEditMode = (taskID: number, taskValue: string) => {
    setEditModeID(O.none);

    if (!taskValue.trim()) {
      onRemoveTask(taskID, false);
    }
  };

  return (
    <div className="TaskList">
      {!!tasks.length && (
        <p className={generateLinkClasses} onClick={toggleCompletedTasks}>
          {hideCompletedTasksFlag ? (
            <span>إظهار المهام المكتملة</span>
          ) : (
              <span>إخفاء المهام المكتملة</span>
            )}
        </p>
      )}
      <ul className="TaskList__list">
        {tasks.length ? (
          tasks
            .filter((task) => !hideCompletedTasksFlag || !task.done)
            .reverse()
            .map((task) => (
              <li className={generateTaskClasses(task.done)} key={task.id}>
                {task.done}
                <div
                  className="TaskList__checkbox"
                  onClick={() => toggleTask(task.id)}
                >
                  <img
                    className="TaskList__checkboxImg"
                    src={checkmarkIcon}
                    alt="checkmark"
                  />
                </div>
                <div className="TaskList__valueContent">
                  {
                    pipe(
                      editModeID,
                      O.filter(n => n === task.id),
                      O.fold(
                        () => (
                          <>
                            <p
                              className="TaskList__value"
                              onClick={() => setEditModeID(O.some(task.id))}
                            >
                              {task.value}
                            </p>
                            <img
                              src={basketIcon}
                              className="TaskList__deleteIcon"
                              alt="basket-icon"
                              onClick={() => onRemoveTask(task.id, true)}
                            />
                          </>
                        ),
                        (n) => (
                          <input
                            className="TaskList__valueInput"
                            type="text"
                            value={task.value}
                            onChange={(event) =>
                              updateTask(event.target.value, task.id)
                            }
                            onBlur={() => exitEditMode(task.id, task.value)}
                            onKeyDown={(event) =>
                              event.key === "Enter" &&
                              onKeyDown(event.currentTarget.value, task.id)
                            }
                          />
                        )
                      )
                    )
                  }
                </div>
              </li>
            ))
        ) : (
            <EmptyList />
          )}
      </ul>
    </div>
  );
};

export default TaskList;
