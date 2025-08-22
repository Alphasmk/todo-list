import { Card, List, Checkbox, Button, Space, Typography, Empty } from 'antd';
import { useState } from 'react';
import axios from 'axios';

const { Title, Text } = Typography;
function TaskComponent({tasks, onTaskUpdate, onTaskEdit, setNewTask}) {

    const deleteTask = (id) => {
        axios.delete(`http://127.0.0.1:8000/tasks/${id}`).then(resp => {
            onTaskUpdate()
          })
    }

    const setActiveTask = (id, task) => {
        axios.put(`http://127.0.0.1:8000/tasks/${id}`,
        {
            ...task,
            is_done: !task.is_done
        }).then(resp => {
            onTaskUpdate()
        })
    }

    if (tasks.length === 0) {
        return (
          <Card style={{ width: 600 }}>
            <Empty description="Нет задач" />
          </Card>
        )
      }
      return (
        <Card title={`Задачи: ${tasks.length}`} style={{ width: 600 }}>
          <List
            dataSource={tasks}
            renderItem={(task) => (
              <List.Item
                actions={[
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={() => {
                        onTaskEdit(true)
                        setNewTask({
                            "body": task.body,
                            "title": task.title,
                            "is_done": task.is_done,
                            "id": task.id
                        })
                    }}
                  >
                    Редактировать
                  </Button>,
                  <Button 
                    size="small"
                    onClick={() => deleteTask(task.id)}
                  >
                    Удалить
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Checkbox 
                      checked={task.is_done} 
                      onChange={(e) => setActiveTask(task.id, task)}
                    />
                  }
                  title={
                    <Text 
                      delete={task.is_done}
                      style={{ 
                        color: task.is_done ? '#999' : '#000',
                        fontSize: '16px'
                      }}
                    >
                      {task.title}
                    </Text>
                  }
                  description={
                    <Space direction="vertical" size={0}>
                      <Text type="secondary">{task.body}</Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
    )
}

export default TaskComponent