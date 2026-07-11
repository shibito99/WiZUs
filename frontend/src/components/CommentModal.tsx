import { useState, useEffect } from 'react'
import type { Comment } from '../types'
import { getComments, addComment, addReply, deleteComment } from '../api/posts'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'

interface Props {
  postId: number
  onClose: () => void
  onCommentAdded: () => void
}

export default function CommentModal({ postId, onClose, onCommentAdded }: Props) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    getComments(postId).then(({ data }) => setComments(data))
  }, [postId])

  const submit = async () => {
    if (!text.trim()) return
    const { data } = await addComment(postId, text)
    setComments(prev => [...prev, data])
    setText('')
    onCommentAdded()
  }

  const submitReply = async (commentId: number) => {
    if (!replyText.trim()) return
    const { data } = await addReply(commentId, replyText)
    setComments(prev => prev.map(c =>
      c.id === commentId ? { ...c, replies: [...c.replies, data] } : c
    ))
    setReplyTo(null)
    setReplyText('')
  }

  const handleDelete = async (id: number, parentId?: number) => {
    await deleteComment(id)
    if (parentId) {
      setComments(prev => prev.map(c =>
        c.id === parentId ? { ...c, replies: c.replies.filter(r => r.id !== id) } : c
      ))
    } else {
      setComments(prev => prev.filter(c => c.id !== id))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white w-full sm:w-xl sm:rounded-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-semibold text-gray-900">コメント</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="space-y-2">
              <div className="flex items-start gap-2">
                <Avatar url={comment.avatarUrl} username={comment.username} size="sm" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{comment.username}</span>
                    {user?.id === comment.userId && (
                      <button onClick={() => handleDelete(comment.id)} className="text-xs text-gray-300 hover:text-red-400">削除</button>
                    )}
                  </div>
                  <p className="text-sm text-gray-800">{comment.content}</p>
                  <button onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)} className="text-xs text-indigo-500 mt-1">返信</button>
                </div>
              </div>
              {comment.replies.map(reply => (
                <div key={reply.id} className="ml-10 flex items-start gap-2">
                  <Avatar url={reply.avatarUrl} username={reply.username} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{reply.username}</span>
                      {user?.id === reply.userId && (
                        <button onClick={() => handleDelete(reply.id, comment.id)} className="text-xs text-gray-300 hover:text-red-400">削除</button>
                      )}
                    </div>
                    <p className="text-sm text-gray-800">{reply.content}</p>
                  </div>
                </div>
              ))}
              {replyTo === comment.id && (
                <div className="ml-10 flex gap-2">
                  <input
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="返信を入力..."
                    className="flex-1 border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:border-indigo-400"
                  />
                  <button onClick={() => submitReply(comment.id)} className="text-sm text-indigo-600 font-semibold">送信</button>
                </div>
              )}
            </div>
          ))}
        </div>
        {user && (
          <div className="border-t p-3 flex gap-2">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="コメントを入力..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-indigo-400"
            />
            <button onClick={submit} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-full hover:bg-indigo-700">送信</button>
          </div>
        )}
      </div>
    </div>
  )
}
