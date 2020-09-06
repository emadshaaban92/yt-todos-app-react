import React, {useState} from 'react';
import PropTypes from 'prop-types';
import checkmarkIcon from '../../assets/icon-checkmark.svg';
import basketIcon from '../../assets/icon-basket.svg';
import EmptyList from "../EmptyList/EmptyList.view";

import './TaskList.style.scss';

const TaskList = ({tasks, setTasks}) => {
  const [editModeID, setEditModeID] = useState(-1);

  const onUpdateTask = (event, taskID) => {
    const taskValue = event.target.value;

    setTasks(prevState => {
      return prevState.map(task => {
        if (task.id === taskID) {
          return {...task, value: taskValue}
        }
        else {
          return task;
        }
      });
    });
  };

  const onRemoveTask = (taskID, shouldConfirm) => {
    if (shouldConfirm) {
      const result = window.confirm('سيتم حذف هذه المهمه نهائيا, هل أنت متأكد؟');

      if (!result) {
        return false;
      }
    }

    setTasks(prevState => {
      return prevState.filter(task => {
        return task.id !== taskID
      });
    });
  };

  const onKeyDown = (event, taskID) => {
    if (event.key === 'Enter') {
      const taskValue = event.target.value;

      setEditModeID(-1);

      if (!taskValue.trim()) {
        onRemoveTask(taskID);
      }
    }
  };

  const onCheckTask = (taskID) => {
    setTasks(prevState => {
      return prevState.map(task => {
        if (task.id === taskID) {
          return {...task, done: !task.done}
        }
        else {
          return task;
        }
      });
    });
  };

  const shouldEditTask = (taskID) => taskID === editModeID;

  const generateClasses = done => `TaskList__taskContent ${done ? 'TaskList__taskContent--isActive' : ''}`;

  return (
    <ul className='TaskList'>
      {tasks.length ?
        tasks.map(task =>
          <li className={generateClasses(task.done)}>
            {task.done}
            <div className='TaskList__checkbox'
                 onClick={() => onCheckTask(task.id)}>
              <img className='TaskList__checkboxImg' src={checkmarkIcon} alt="checkmark"/>
            </div>
            <div className='TaskList__valueContent'>
              {shouldEditTask(task.id) ?
                <input className='TaskList__valueInput'
                       type="text"
                       value={task.value}
                       onChange={event => onUpdateTask(event, task.id)}
                       autoFocus={true}
                       onBlur={() => setEditModeID(-1)}
                       onKeyDown={event => onKeyDown(event, task.id)}/> :
                <p className='TaskList__value'
                   onClick={() => setEditModeID(task.id)}>{
                  task.value}
                </p>
              }
              {!shouldEditTask(task.id) && <img src={basketIcon}
                                                className='TaskList__deleteIcon'
                                                alt="basket-icon"
                                                onClick={() => onRemoveTask(task.id, true)}/>}
            </div>
          </li>)
        :
        <EmptyList/>}
    </ul>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object),
}

export default TaskList;

//edit data in input
//PWA
//Dark Theme