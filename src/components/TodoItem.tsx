'use client'

import { supabase } from '../lib/supabase'
import type { Todo } from '../lib/supabase'

interface TodoItemProps {
  todo: Todo
}

export default function TodoItem({ todo }: TodoItemProps) {
  const toggleComplete = async () => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ is_complete: !todo.is_complete })
        .eq('id', todo.id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const deleteTodo = async () => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', todo.id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow mb-2">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={todo.is_complete}
          onChange={toggleComplete}
          className="w-5 h-5 rounded border-gray-300 focus:ring-blue-500"
        />
        <span className={`${todo.is_complete ? 'line-through text-gray-500' : ''}`}>
          {todo.task}
        </span>
      </div>
      <button
        onClick={deleteTodo}
        className="text-red-500 hover:text-red-700 focus:outline-none"
      >
        Delete
      </button>
    </div>
  )
} 