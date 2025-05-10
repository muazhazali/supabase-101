'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Todo } from '../lib/supabase'
import TodoItem from './TodoItem'
import AddTodo from './AddTodo'

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    // Fetch initial todos
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching todos:', error)
        return
      }

      setTodos(data || [])
    }

    fetchTodos()

    // Set up real-time subscription
    const channel = supabase
      .channel('todos')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTodos(prev => [payload.new as Todo, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setTodos(prev => prev.filter(todo => todo.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setTodos(prev =>
              prev.map(todo =>
                todo.id === payload.new.id ? (payload.new as Todo) : todo
              )
            )
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Todo List</h1>
      <AddTodo />
      <div className="space-y-2">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  )
} 