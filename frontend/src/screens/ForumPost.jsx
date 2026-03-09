import { useState, memo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForum } from '../hooks/useForum'
import { useAuth } from '../hooks/useAuth'
import { Avatar, timeAgo } from '../components/common/PostCard'
import EmptyIllustration from '../components/common/EmptyIllustration'
import AppNav from '../components/nav/AppNav'

const ArrowLeft = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
)

const UpArrow = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4L3 15h6v5h6v-5h6L12 4z" />
  </svg>
)

const SendIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)

const PencilIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const XIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

/* ── Upvote button ── */
const UpvoteBtn = memo(function UpvoteBtn({ count, active, onClick, size = 'md' }) {
  const [hover, setHover] = useState(false)
  const sm = size === 'sm'
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={active ? 'Remove upvote' : 'Upvote'}
      style={{
        display: 'flex', alignItems: 'center', gap: sm ? 4 : 5,
        padding: sm ? '4px 10px' : '6px 14px',
        borderRadius: 20, border: 'none', cursor: 'pointer',
        background: active
          ? 'rgba(99,102,241,0.18)'
          : hover ? 'rgba(99,102,241,0.09)' : 'var(--bg-card)',
        color: active ? 'var(--accent-main)' : hover ? 'var(--accent-main)' : 'var(--primary-text-muted)',
        fontFamily: 'var(--font-display)',
        fontSize: sm ? 12 : 13, fontWeight: 700,
        transition: 'all 0.15s ease',
        borderWidth: 1, borderStyle: 'solid',
        borderColor: active ? 'rgba(99,102,241,0.4)' : hover ? 'rgba(99,102,241,0.25)' : 'var(--border-light)',
        transform: hover && !active ? 'translateY(-1px)' : 'none',
        boxShadow: active ? '0 2px 8px rgba(99,102,241,0.25)' : 'none',
      }}
    >
      <UpArrow />
      <span>{count ?? 0}</span>
    </button>
  )
})

/* ── Single reply bubble ── */
const ReplyBubble = memo(function ReplyBubble({ reply, postId, upvoteReply, hasUpvoted, isOwner, onEdit, onDelete }) {
  const isInstructor = reply.author === 'Physics Lab'
  const didUpvote    = hasUpvoted(`${postId}:${reply.id}`)
  const [editing, setEditing]       = useState(false)
  const [editText, setEditText]     = useState('')
  const [confirmDel, setConfirmDel] = useState(false)

  const startEdit = () => { setEditText(reply.body); setEditing(true) }
  const saveEdit  = () => {
    if (editText.trim().length < 3) return
    onEdit?.(postId, reply.id, editText.trim())
    setEditing(false)
  }

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <Avatar name={reply.author} size={36} />

      <div style={{
        flex: 1,
        borderRadius: '4px 18px 18px 18px',
        background: isInstructor ? 'rgba(99,102,241,0.06)' : 'var(--bg-card)',
        border: `1px solid ${isInstructor ? 'rgba(99,102,241,0.2)' : 'var(--border-light)'}`,
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '12px 16px 10px',
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
          borderBottom: '1px solid var(--border-light)',
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-text)' }}>
            {reply.author}
          </span>
          {isInstructor && (
            <span style={{
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
              color: 'var(--accent-main)', background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.22)', padding: '1px 8px', borderRadius: 20,
            }}>Instructor</span>
          )}
          <span style={{ fontSize: 12, color: 'var(--primary-text-muted)', marginLeft: 'auto' }}>
            {timeAgo(reply.createdAt)}
          </span>
          {isOwner && !editing && (
            <div style={{ display: 'flex', gap: 4, marginLeft: 4 }}>
              <button type="button" onClick={startEdit} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px',
                color: 'var(--accent-main)', fontSize: 11, fontWeight: 600,
                borderRadius: 6, transition: 'background 0.15s',
              }}>
                Edit
              </button>
              {!confirmDel ? (
                <button type="button" onClick={() => setConfirmDel(true)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px',
                  color: '#ef4444', fontSize: 11, fontWeight: 600,
                  borderRadius: 6, transition: 'background 0.15s',
                }}>
                  Delete
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  <button type="button" onClick={() => { onDelete?.(postId, reply.id); setConfirmDel(false) }} style={{
                    background: '#ef4444', border: 'none', cursor: 'pointer', padding: '2px 8px',
                    color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 6,
                  }}>
                    Yes
                  </button>
                  <button type="button" onClick={() => setConfirmDel(false)} style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border-light)',
                    cursor: 'pointer', padding: '2px 8px',
                    color: 'var(--primary-text-muted)', fontSize: 11, fontWeight: 600, borderRadius: 6,
                  }}>
                    No
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Body — view or edit mode */}
        {editing ? (
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              rows={3}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 10,
                border: '1px solid var(--border-medium)', background: 'var(--primary-bg)',
                color: 'var(--primary-text)', fontSize: 14, lineHeight: 1.65,
                fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" onClick={saveEdit} disabled={editText.trim().length < 3} style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                background: editText.trim().length >= 3 ? 'var(--gradient-accent)' : 'var(--bg-card)',
                color: editText.trim().length >= 3 ? '#fff' : 'var(--primary-text-muted)',
                border: '1px solid var(--border-light)', cursor: editText.trim().length >= 3 ? 'pointer' : 'not-allowed',
              }}>
                Save
              </button>
              <button type="button" onClick={() => setEditing(false)} style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: 'var(--bg-card)', border: '1px solid var(--border-light)',
                color: 'var(--primary-text-muted)', cursor: 'pointer',
              }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p style={{
            margin: 0, padding: '12px 16px',
            fontSize: 14, color: 'var(--primary-text)', lineHeight: 1.7, whiteSpace: 'pre-wrap',
          }}>
            {reply.body}
          </p>
        )}

        {/* Footer: upvote */}
        <div style={{ padding: '8px 16px 12px', display: 'flex', alignItems: 'center' }}>
          <UpvoteBtn
            count={reply.upvotes}
            active={didUpvote}
            size="sm"
            onClick={() => upvoteReply(postId, reply.id)}
          />
        </div>
      </div>
    </div>
  )
})

export default function ForumPost() {
  const { postId }                                      = useParams()
  const navigate                                        = useNavigate()
  const { user } = useAuth()
  const { getPost, addReply, editReply, deleteReply, deletePost, editPost, upvotePost, upvoteReply, hasUpvoted } = useForum()

  const post = getPost(postId)

  const displayName = user?.name || user?.email || 'Anonymous'
  const isGuest = !user || user.is_guest
  const [replyText,  setReplyText]  = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [editing,    setEditing]    = useState(false)
  const [editTitle,  setEditTitle]  = useState('')
  const [editBody,   setEditBody]   = useState('')
  const [confirmDel, setConfirmDel] = useState(false)

  const isOwner = post && displayName === post.author

  if (!post) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 52 }}>🌀</div>
          <p style={{ fontSize: 18, color: 'var(--primary-text-muted)', margin: 0 }}>Post not found.</p>
          <button type="button" onClick={() => navigate('/forum')} style={{
            color: '#fff', background: 'var(--gradient-accent)', border: 'none',
            fontWeight: 700, cursor: 'pointer', fontSize: 14,
            padding: '10px 22px', borderRadius: 10,
          }}>← Back to community</button>
        </div>
      </div>
    )
  }

  const handleReply = () => {
    const text = replyText.trim()
    if (!text || text.length < 5 || submitting) return
    setSubmitting(true)
    addReply(post.id, text, displayName)
    setReplyText('')
    setSubmitting(false)
  }

  const startEdit = () => {
    setEditTitle(post.title)
    setEditBody(post.body || '')
    setEditing(true)
  }

  const saveEdit = () => {
    if (editTitle.trim().length < 3) return
    editPost(post.id, editTitle.trim(), editBody.trim())
    setEditing(false)
  }

  const handleDelete = () => {
    deletePost(post.id)
    navigate('/forum')
  }

  const canReply   = replyText.trim().length >= 5 && !submitting
  const didUpvote  = hasUpvoted(post.id)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--primary-bg)' }}>

      <AppNav />

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '24px 24px 80px', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* ── Breadcrumb ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button type="button" onClick={() => navigate('/forum')} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--primary-text-muted)', fontSize: 13, fontWeight: 600, padding: 0,
          }}>
            <ArrowLeft /> Community
          </button>
          <span style={{ color: 'var(--border-medium)' }}>/</span>
          <span style={{
            fontSize: 13, color: 'var(--primary-text)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: 400,
          }}>{post.title}</span>
        </div>

        {/* ── Original post ── */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          borderRadius: 20, overflow: 'hidden',
        }}>
          {/* Gradient top stripe */}
          <div style={{
            height: 4,
            background: post.videoUrl
              ? 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)'
              : 'linear-gradient(90deg, #6366f1, #818cf8)',
          }} />

          {/* Video */}
          {post.videoUrl && (
            <div style={{ position: 'relative', background: '#000' }}>
              <video
                src={post.videoUrl}
                controls loop playsInline
                style={{ width: '100%', maxHeight: 420, display: 'block', objectFit: 'contain', background: '#000' }}
              />
              <div style={{
                position: 'absolute', top: 12, left: 12,
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)',
                border: '1px solid rgba(139,92,246,0.5)',
                borderRadius: 20, padding: '4px 12px',
              }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#a78bfa', animation: 'pulse 2s ease-in-out infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {post.videoUrl.startsWith('/uploads/') ? 'Uploaded video' : 'Manim · physics.bytewave'}
                </span>
              </div>
            </div>
          )}

          {/* Uploaded images */}
          {post.imageUrls?.length > 0 && (
            <div style={{
              display: 'flex', gap: 8, padding: '12px 16px',
              overflowX: 'auto', background: 'rgba(0,0,0,0.2)',
            }}>
              {post.imageUrls.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ flexShrink: 0 }}>
                  <img
                    src={url} alt={`Attachment ${i + 1}`}
                    style={{
                      height: 180, maxWidth: 320, borderRadius: 10,
                      objectFit: 'cover', display: 'block',
                      border: '1px solid var(--border-light)',
                    }}
                  />
                </a>
              ))}
            </div>
          )}

          {/* Post body */}
          <div style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Author + time + actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name={post.author} size={42} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--primary-text)' }}>{post.author}</p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--primary-text-muted)' }}>{timeAgo(post.createdAt)}</p>
              </div>
              {isOwner && !editing && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button type="button" onClick={startEdit} title="Edit post" style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '6px 12px', borderRadius: 8,
                    background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                    color: 'var(--accent-main)', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.15s ease',
                  }}>
                    <PencilIcon /> Edit
                  </button>
                  {!confirmDel ? (
                    <button type="button" onClick={() => setConfirmDel(true)} title="Delete post" style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '6px 12px', borderRadius: 8,
                      background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
                      color: '#ef4444', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.15s ease',
                    }}>
                      <TrashIcon /> Delete
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600, marginRight: 4 }}>Sure?</span>
                      <button type="button" onClick={handleDelete} style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '6px 10px', borderRadius: 8,
                        background: '#ef4444', border: 'none',
                        color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      }}>
                        <CheckIcon /> Yes
                      </button>
                      <button type="button" onClick={() => setConfirmDel(false)} style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '6px 10px', borderRadius: 8,
                        background: 'var(--bg-card)', border: '1px solid var(--border-light)',
                        color: 'var(--primary-text-muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      }}>
                        <XIcon /> No
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {editing ? (
              <>
                <input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  maxLength={300}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: 12,
                    border: '1px solid var(--border-medium)', background: 'var(--primary-bg)',
                    color: 'var(--primary-text)', fontSize: 18, fontWeight: 700,
                    fontFamily: 'var(--font-display)', outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <textarea
                  value={editBody}
                  onChange={e => setEditBody(e.target.value)}
                  rows={6}
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: 12,
                    border: '1px solid var(--border-medium)', background: 'var(--primary-bg)',
                    color: 'var(--primary-text)', fontSize: 14, lineHeight: 1.7,
                    fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={saveEdit} disabled={editTitle.trim().length < 3} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '10px 20px', borderRadius: 10,
                    background: editTitle.trim().length >= 3 ? 'var(--gradient-accent)' : 'var(--bg-card)',
                    color: editTitle.trim().length >= 3 ? '#fff' : 'var(--primary-text-muted)',
                    border: '1px solid var(--border-light)', fontSize: 13, fontWeight: 700,
                    fontFamily: 'var(--font-display)', cursor: editTitle.trim().length >= 3 ? 'pointer' : 'not-allowed',
                    boxShadow: editTitle.trim().length >= 3 ? '0 2px 10px rgba(99,102,241,0.35)' : 'none',
                  }}>
                    <CheckIcon /> Save changes
                  </button>
                  <button type="button" onClick={() => setEditing(false)} style={{
                    padding: '10px 20px', borderRadius: 10,
                    background: 'var(--bg-card)', border: '1px solid var(--border-light)',
                    color: 'var(--primary-text-muted)', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer',
                  }}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Title */}
                <h1 style={{
                  margin: 0, fontFamily: 'var(--font-display)',
                  fontSize: 22, fontWeight: 800, color: 'var(--primary-text)',
                  lineHeight: 1.35, letterSpacing: '-0.02em',
                }}>
                  {post.title}
                </h1>

                {/* Body */}
                {post.body && (
                  <div style={{
                    padding: '16px 20px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 12,
                  }}>
                    <p style={{ margin: 0, fontSize: 15, color: 'var(--primary-text)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                      {post.body}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--primary-text-muted)', marginRight: 2 }}>
                  AI tags
                </span>
                {post.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: 12, fontWeight: 600, color: 'var(--accent-main)',
                    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                    padding: '3px 10px', borderRadius: 20,
                  }}>{tag}</span>
                ))}
              </div>
            )}

            {/* Post-level upvote + reply count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 4, borderTop: '1px solid var(--border-light)' }}>
              <UpvoteBtn
                count={post.upvotes}
                active={didUpvote}
                onClick={() => upvotePost(post.id)}
              />
              <span style={{ fontSize: 13, color: 'var(--primary-text-muted)' }}>
                {post.replies?.length ?? 0} {post.replies?.length === 1 ? 'reply' : 'replies'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Replies ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--primary-text)' }}>
              {post.replies.length === 0 ? 'Discussion' : 'Replies'}
            </h2>
            {post.replies.length > 0 && (
              <span style={{
                padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                background: 'rgba(99,102,241,0.12)', color: 'var(--accent-main)',
                border: '1px solid rgba(99,102,241,0.2)',
              }}>{post.replies.length}</span>
            )}
          </div>

          {post.replies.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '40px 20px',
              background: 'var(--bg-card)', border: '1px solid var(--border-light)',
              borderRadius: 16, color: 'var(--primary-text-muted)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            }}>
              <EmptyIllustration type="no-replies" size={72} />
              <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>No replies yet</p>
              <p style={{ margin: 0, fontSize: 13 }}>Be the first to help out below ↓</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {post.replies.map(r => (
                <ReplyBubble
                  key={r.id}
                  reply={r}
                  postId={post.id}
                  upvoteReply={upvoteReply}
                  hasUpvoted={hasUpvoted}
                  isOwner={displayName === r.author}
                  onEdit={editReply}
                  onDelete={deleteReply}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Reply form ── */}
        {isGuest ? (
          <div style={{
            padding: '32px 26px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 20, textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          }}>
            <div style={{ fontSize: 28 }}>🔒</div>
            <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--primary-text)' }}>
              Sign in to reply
            </p>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--primary-text-muted)', maxWidth: 320, lineHeight: 1.5 }}>
              Create an account to join the discussion and help others learn.
            </p>
            <button type="button" onClick={() => navigate('/auth')} style={{
              marginTop: 4, padding: '11px 28px', borderRadius: 12,
              background: 'var(--gradient-accent)', border: 'none',
              color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
            }}>
              Sign in →
            </button>
          </div>
        ) : (
          <div style={{
            padding: '24px 26px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: 20,
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--primary-text)' }}>
              Add a reply
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar name={displayName} size={36} />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary-text)' }}>{displayName}</span>
            </div>

            <div style={{
              border: '1px solid var(--border-medium)', borderRadius: 14,
              overflow: 'hidden', background: 'var(--primary-bg)',
            }}>
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Share your explanation, approach, or helpful tip..."
                rows={4}
                style={{
                  width: '100%', padding: '14px 16px',
                  border: 'none', outline: 'none',
                  background: 'transparent',
                  color: 'var(--primary-text)', fontSize: 14,
                  fontFamily: 'var(--font-body)', resize: 'none', lineHeight: 1.65,
                  boxSizing: 'border-box',
                }}
              />
              <div style={{
                padding: '10px 14px',
                borderTop: '1px solid var(--border-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 12, color: 'var(--primary-text-muted)' }}>
                  {replyText.length > 0 ? `${replyText.length} chars` : 'Min 5 characters'}
                </span>
                <button
                  type="button"
                  onClick={handleReply}
                  disabled={!canReply}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '8px 18px', borderRadius: 10,
                    background: canReply ? 'var(--gradient-accent)' : 'var(--bg-card)',
                    color: canReply ? '#fff' : 'var(--primary-text-muted)',
                    border: '1px solid var(--border-light)',
                    fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700,
                    cursor: canReply ? 'pointer' : 'not-allowed',
                    boxShadow: canReply ? '0 2px 10px rgba(99,102,241,0.35)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <SendIcon /> Post reply
                </button>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: 12, color: 'var(--primary-text-muted)' }}>
              Keep it constructive — your reply helps others who are stuck on the same topic.
            </p>
          </div>
        )}
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.85); }
        }
      `}</style>
    </div>
  )
}
