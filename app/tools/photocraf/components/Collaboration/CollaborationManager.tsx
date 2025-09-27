'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useEditor } from './../../contexts/EditorContext'
import { useSlots } from './../../contexts/SlotContext'
import { showToast } from './../UI/Toast'

interface User {
  id: string
  name: string
  color: string
  cursor?: { x: number; y: number }
  isActive: boolean
}

interface CollaborationRoom {
  id: string
  name: string
  users: User[]
  host: string
  createdAt: Date
}

export default function CollaborationManager() {
  const { state } = useEditor()
  const { slotState } = useSlots()
  const [isCollaborating, setIsCollaborating] = useState(false)
  const [room, setRoom] = useState<CollaborationRoom | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [roomCode, setRoomCode] = useState('')
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [userName, setUserName] = useState('')
  const connectionRef = useRef<RTCPeerConnection | null>(null)
  const dataChannelRef = useRef<RTCDataChannel | null>(null)

  // Check if user has team plan or higher
  const canCollaborate = slotState.plan === 'unlimited'

  // User colors for cursors
  const userColors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#FFA07A', // Light Salmon
    '#98D8C8', // Mint
    '#FDCB6E', // Yellow
    '#6C5CE7', // Purple
    '#A8E6CF', // Light Green
  ]

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const createRoom = async () => {
    if (!canCollaborate) {
      showToast('Collaboration requires Unlimited plan', 'warning')
      return
    }

    if (!userName.trim()) {
      showToast('Please enter your name', 'warning')
      return
    }

    const newRoomCode = generateRoomCode()
    const newRoom: CollaborationRoom = {
      id: newRoomCode,
      name: `${userName}'s Room`,
      users: [
        {
          id: `user-${Date.now()}`,
          name: userName,
          color: userColors[0],
          isActive: true,
        }
      ],
      host: userName,
      createdAt: new Date(),
    }

    setRoom(newRoom)
    setRoomCode(newRoomCode)
    setIsCollaborating(true)
    setUsers(newRoom.users)
    
    // Initialize WebRTC
    await initializeConnection(true)
    
    showToast(`Room created! Share code: ${newRoomCode}`, 'success')
  }

  const joinRoom = async () => {
    if (!canCollaborate) {
      showToast('Collaboration requires Unlimited plan', 'warning')
      return
    }

    if (!roomCode.trim() || !userName.trim()) {
      showToast('Please enter room code and your name', 'warning')
      return
    }

    // Simulate joining room (in production, this would connect to a signaling server)
    const joinedRoom: CollaborationRoom = {
      id: roomCode,
      name: `Collaborative Session`,
      users: [
        {
          id: `user-${Date.now()}`,
          name: userName,
          color: userColors[Math.floor(Math.random() * userColors.length)],
          isActive: true,
        }
      ],
      host: 'Unknown',
      createdAt: new Date(),
    }

    setRoom(joinedRoom)
    setIsCollaborating(true)
    setUsers(joinedRoom.users)
    setShowJoinModal(false)
    
    // Initialize WebRTC
    await initializeConnection(false)
    
    showToast(`Joined room: ${roomCode}`, 'success')
  }

  const initializeConnection = async (isHost: boolean) => {
    try {
      // Create peer connection
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      }
      
      const pc = new RTCPeerConnection(configuration)
      connectionRef.current = pc

      // Create data channel for sending canvas updates
      if (isHost) {
        const dataChannel = pc.createDataChannel('canvas-sync')
        dataChannelRef.current = dataChannel

        dataChannel.onopen = () => {
          console.log('Data channel opened')
        }

        dataChannel.onmessage = (event) => {
          handleRemoteUpdate(JSON.parse(event.data))
        }

        // Create offer
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        
        // In production, send offer to signaling server
        console.log('Offer created:', offer)
      } else {
        // Wait for data channel from host
        pc.ondatachannel = (event) => {
          const dataChannel = event.channel
          dataChannelRef.current = dataChannel

          dataChannel.onmessage = (event) => {
            handleRemoteUpdate(JSON.parse(event.data))
          }
        }
      }

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          // In production, send candidate to signaling server
          console.log('ICE candidate:', event.candidate)
        }
      }

    } catch (error) {
      console.error('Failed to initialize connection:', error)
      showToast('Failed to establish connection', 'error')
    }
  }

  const handleRemoteUpdate = (data: any) => {
    // Handle different types of updates
    switch (data.type) {
      case 'cursor':
        updateUserCursor(data.userId, data.position)
        break
      case 'canvas':
        // Update canvas with remote changes
        console.log('Canvas update received:', data)
        break
      case 'filter':
        // Apply filter from remote user
        console.log('Filter update received:', data)
        break
      case 'user-join':
        // Add new user to the room
        const newUser: User = {
          id: data.userId,
          name: data.userName,
          color: userColors[users.length % userColors.length],
          isActive: true,
        }
        setUsers(prev => [...prev, newUser])
        showToast(`${data.userName} joined the room`, 'info')
        break
      case 'user-leave':
        // Remove user from room
        setUsers(prev => prev.filter(u => u.id !== data.userId))
        showToast(`${data.userName} left the room`, 'info')
        break
    }
  }

  const updateUserCursor = (userId: string, position: { x: number; y: number }) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, cursor: position }
        : user
    ))
  }

  const sendUpdate = (type: string, data: any) => {
    if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
      dataChannelRef.current.send(JSON.stringify({
        type,
        ...data,
        timestamp: Date.now(),
      }))
    }
  }

  const leaveRoom = () => {
    if (connectionRef.current) {
      connectionRef.current.close()
      connectionRef.current = null
    }
    if (dataChannelRef.current) {
      dataChannelRef.current.close()
      dataChannelRef.current = null
    }

    setIsCollaborating(false)
    setRoom(null)
    setUsers([])
    setRoomCode('')
    
    showToast('Left collaboration room', 'info')
  }

  // Track mouse movement and send to other users
  useEffect(() => {
    if (!isCollaborating) return

    const handleMouseMove = (e: MouseEvent) => {
      sendUpdate('cursor', {
        userId: users[0]?.id,
        position: { x: e.clientX, y: e.clientY }
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isCollaborating, users])

  return (
    <>
      {/* Collaboration Status Bar */}
      <div className="fixed top-20 right-4 z-40">
        {!isCollaborating ? (
          <div className="bg-gray-900 rounded-lg shadow-lg p-3 space-y-2">
            <h3 className="text-sm font-medium mb-2">Collaboration</h3>
            
            {!canCollaborate ? (
              <div className="text-xs text-yellow-400">
                🔒 Upgrade to Unlimited plan for collaboration
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-2 py-1 bg-gray-800 rounded text-sm mb-2"
                />
                <button
                  onClick={createRoom}
                  className="w-full px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                >
                  Create Room
                </button>
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="w-full px-3 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                >
                  Join Room
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="bg-gray-900 rounded-lg shadow-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Room: {roomCode}</h3>
              <button
                onClick={leaveRoom}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Leave
              </button>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Active Users:</p>
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-2"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: user.color }}
                  />
                  <span className="text-xs">{user.name}</span>
                  {user.cursor && (
                    <span className="text-xs text-gray-500">
                      ({Math.round(user.cursor.x)}, {Math.round(user.cursor.y)})
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 p-2 bg-gray-800 rounded">
              <p className="text-xs text-gray-400">Share this code:</p>
              <p className="text-sm font-mono font-bold text-purple-400">
                {roomCode}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Join Collaboration Room</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 rounded"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Room Code</label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-gray-800 rounded font-mono"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowJoinModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={joinRoom}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cursor Overlay - Shows other users' cursors */}
      {isCollaborating && (
        <div className="fixed inset-0 pointer-events-none z-30">
          {users.filter(u => u.cursor).map((user) => (
            <div
              key={user.id}
              className="absolute transition-all duration-100"
              style={{
                left: user.cursor?.x,
                top: user.cursor?.y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill={user.color}
                className="drop-shadow-lg"
              >
                <path d="M0 0L20 7L7 20L0 0Z" />
              </svg>
              <span
                className="absolute top-5 left-5 text-xs font-medium px-1 py-0.5 rounded whitespace-nowrap"
                style={{
                  backgroundColor: user.color,
                  color: 'white',
                }}
              >
                {user.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}