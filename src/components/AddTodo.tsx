'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AddTodo() {
  const [task, setTask] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!task.trim()) return

    try {
      const { error } = await supabase
        .from('todos')
        .insert([
          {
            task,
            is_complete: false,
          },
        ])

      if (error) throw error
      setTask('')
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add
      </button>
    </form>
  )
} 