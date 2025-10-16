// app/tools/pdf-tools/components/ToolPanel.tsx
import { Tool } from '../types'
import { useEffect, useState, useRef } from 'react'
import {
  Plus,
  X,
  MoreVertical,
  Edit3,
  Trash2,
  Settings,
  ChevronDown,
} from 'lucide-react'

interface ToolPanelProps {
  isMobile: boolean
  showMobileMenu: boolean
  setShowMobileMenu: (show: boolean) => void
  activeToolSlots: (Tool | null)[]
  handleSlotClick: (index: number) => void
  isSelectingTool: number | null
  setIsSelectingTool: (index: number | null) => void
  availableTools: Tool[]
  handleToolSelect: (tool: Tool, slotIndex: number) => void
}

export function ToolPanel({
  isMobile,
  showMobileMenu,
  setShowMobileMenu,
  activeToolSlots,
  handleSlotClick,
  isSelectingTool,
  setIsSelectingTool,
  availableTools,
  handleToolSelect,
}: ToolPanelProps) {
  const [showManageModal, setShowManageModal] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchOffset, setTouchOffset] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)

  // Handle swipe down to close
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobile && showMobileMenu) {
      setTouchStart(e.touches[0].clientY)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart !== null && isMobile && showMobileMenu) {
      const currentTouch = e.touches[0].clientY
      const diff = currentTouch - touchStart
      
      // Only allow downward swipes
      if (diff > 0) {
        setTouchOffset(diff)
      }
    }
  }

  const handleTouchEnd = () => {
    if (touchOffset > 100) {
      // Close if swiped down more than 100px
      setShowMobileMenu(false)
    }
    
    setTouchStart(null)
    setTouchOffset(0)
  }

  // Handle body scroll lock when modals are open
  useEffect(() => {
    if (isSelectingTool !== null || showManageModal) {
      document.body.style.overflow = 'hidden'

      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        if (!target.closest('.tool-selector-modal') && !target.closest('.manage-tools-modal')) {
          setIsSelectingTool(null)
          setShowManageModal(false)
        }
      }

      const timer = setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 100)

      return () => {
        clearTimeout(timer)
        document.removeEventListener('click', handleClickOutside)
        document.body.style.overflow = ''
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [isSelectingTool, showManageModal, setIsSelectingTool])

  // Filter out already selected tools and mobile-disabled tools
  const getAvailableToolsForSlot = () => {
    const selectedToolIds = activeToolSlots.filter((tool) => tool !== null).map((tool) => tool!.id)
    return availableTools.filter((tool) => {
      // Exclude already selected tools
      if (selectedToolIds.includes(tool.id)) return false
      
      // Exclude mobile-disabled tools on mobile
      if (isMobile && (tool as any).mobileDisabled) return false
      
      return true
    })
  }

  const handleRemoveTool = (index: number) => {
    handleToolSelect(null as any, index)
  }

  const handleAddTool = (index: number) => {
    setShowManageModal(false)
    setIsSelectingTool(index)
  }

  const handleChangeTool = (index: number) => {
    setShowManageModal(false)
    setIsSelectingTool(index)
  }

  // Mobile Bottom Sheet View
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {showMobileMenu && (
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={() => setShowMobileMenu(false)}
          />
        )}

        {/* Bottom Sheet */}
        <div
          ref={panelRef}
          className={`fixed bottom-0 left-0 right-0 z-50 bg-gray-800 rounded-t-2xl shadow-2xl transition-transform duration-300 ${
            showMobileMenu ? 'translate-y-0' : 'translate-y-full'
          }`}
          style={{
            transform: showMobileMenu 
              ? `translateY(${touchOffset}px)` 
              : 'translateY(100%)',
            maxHeight: '50vh',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-4 pb-3 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-white font-medium text-lg">Tools</h3>
            <button
              onMouseDown={(e) => {
                e.preventDefault()
                setShowMobileMenu(false)
              }}
              className="p-2 rounded-lg hover:bg-gray-700 active:bg-gray-600 transition min-h-[48px] min-w-[48px] flex items-center justify-center"
              aria-label="Close tools"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Tool Slots Grid */}
          <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 120px)' }}>
            {/* Manage Button */}
            <button
              onMouseDown={(e) => {
                e.preventDefault()
                setShowManageModal(true)
              }}
              className="w-full mb-4 px-4 py-4 rounded-xl bg-gray-700 hover:bg-gray-600 active:bg-gray-500 transition flex items-center justify-center gap-3 min-h-[56px]"
              aria-label="Manage all tools"
            >
              <MoreVertical className="w-5 h-5 text-gray-300" />
              <span className="text-gray-300 font-medium">Manage All Tools</span>
            </button>

            {/* Tool Grid - 2 columns on mobile */}
            <div className="grid grid-cols-2 gap-3">
              {Array(6)
                .fill(null)
                .map((_, index) => {
                  const tool = activeToolSlots[index]

                  return (
                    <button
                      key={index}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        handleSlotClick(index)
                      }}
                      className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all min-h-[100px] ${
                        tool
                          ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500'
                          : 'bg-gray-900 border-2 border-dashed border-gray-600 hover:border-cyan-400 active:border-cyan-500'
                      }`}
                      aria-label={tool ? tool.name : `Add tool to slot ${index + 1}`}
                    >
                      <div className="text-2xl">
                        {tool ? tool.icon : <Plus className="w-6 h-6 text-gray-500" />}
                      </div>
                      <span className={`text-xs text-center leading-tight ${tool ? 'text-gray-300' : 'text-gray-500'}`}>
                        {tool ? tool.name : `Slot ${index + 1}`}
                      </span>
                    </button>
                  )
                })}
            </div>

            {/* Footer Info */}
            <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
              <p className="text-xs text-gray-400 text-center">
                All 6 slots available - Tap to select tools
              </p>
            </div>
          </div>
        </div>

        {/* Manage Tools Modal (Mobile) */}
        {showManageModal && (
          <>
            <div
              className="fixed inset-0 bg-black/60 z-[60]"
              onClick={() => setShowManageModal(false)}
            />

            <div
              className="manage-tools-modal fixed inset-x-4 top-1/2 -translate-y-1/2 z-[61] bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-medium text-gray-300">Manage Tools</h3>
                </div>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault()
                    setShowManageModal(false)
                  }}
                  className="text-gray-400 hover:text-gray-300 p-2 rounded-lg hover:bg-gray-700 min-h-[48px] min-w-[48px] flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Slots List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {Array(6)
                  .fill(null)
                  .map((_, index) => {
                    const tool = activeToolSlots[index]

                    return (
                      <div
                        key={index}
                        className="p-4 rounded-xl border bg-gray-700/50 border-gray-600"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-400">Slot {index + 1}</span>
                        </div>

                        {tool ? (
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="text-xl">{tool.icon}</div>
                              <span className="text-sm text-gray-300 font-medium">{tool.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onMouseDown={(e) => {
                                  e.preventDefault()
                                  handleChangeTool(index)
                                }}
                                className="p-3 text-cyan-400 hover:bg-gray-700 active:bg-gray-600 rounded-lg transition min-h-[48px] min-w-[48px] flex items-center justify-center"
                                aria-label="Change tool"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onMouseDown={(e) => {
                                  e.preventDefault()
                                  handleRemoveTool(index)
                                }}
                                className="p-3 text-red-400 hover:bg-gray-700 active:bg-gray-600 rounded-lg transition min-h-[48px] min-w-[48px] flex items-center justify-center"
                                aria-label="Remove tool"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onMouseDown={(e) => {
                              e.preventDefault()
                              handleAddTool(index)
                            }}
                            className="w-full px-4 py-3 bg-gray-600 hover:bg-gray-500 active:bg-gray-400 text-gray-300 rounded-lg transition flex items-center justify-center gap-2 min-h-[56px]"
                            aria-label="Add tool"
                          >
                            <Plus className="w-4 h-4" />
                            <span className="font-medium">Add Tool</span>
                          </button>
                        )}
                      </div>
                    )
                  })}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-700 bg-gray-900/50">
                <div className="text-xs text-gray-400 text-center">
                  <span className="text-green-400">All 6 slots available</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tool Selector Modal (Mobile) */}
        {isSelectingTool !== null && (
          <>
            <div
              className="fixed inset-0 bg-black/60 z-[60]"
              onClick={() => setIsSelectingTool(null)}
            />

            <div
              className="tool-selector-modal fixed inset-x-4 top-1/2 -translate-y-1/2 z-[61] bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h3 className="text-base font-medium text-gray-300">
                  Select Tool - Slot {isSelectingTool + 1}
                </h3>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault()
                    setIsSelectingTool(null)
                  }}
                  className="text-gray-400 hover:text-gray-300 p-2 rounded-lg hover:bg-gray-700 min-h-[48px] min-w-[48px] flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {getAvailableToolsForSlot().length > 0 ? (
                    getAvailableToolsForSlot().map((tool) => (
                      <button
                        key={tool.id}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          handleToolSelect(tool, isSelectingTool)
                          setIsSelectingTool(null)
                        }}
                        className="w-full text-left p-4 rounded-xl hover:bg-gray-700 active:bg-gray-600 flex items-center gap-4 text-gray-300 transition min-h-[64px]"
                      >
                        <div className="flex-shrink-0 text-xl">{tool.icon}</div>
                        <span className="text-base font-medium">{tool.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm text-center py-8">
                      All available tools are already added
                    </div>
                  )}

                  {activeToolSlots[isSelectingTool] && (
                    <>
                      <div className="border-t border-gray-700 my-3"></div>
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault()
                          handleRemoveTool(isSelectingTool)
                          setIsSelectingTool(null)
                        }}
                        className="w-full text-left p-4 rounded-xl hover:bg-red-600/20 active:bg-red-600/30 flex items-center gap-4 text-red-400 transition min-h-[64px]"
                      >
                        <X className="w-5 h-5" />
                        <span className="text-base font-medium">Remove Tool</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </>
    )
  }

  // Desktop Sidebar View
  return (
    <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-2 space-y-2">
        {/* Global Manage Button */}
        <button
          onClick={() => setShowManageModal(true)}
          className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-700 hover:bg-gray-600 transition"
          title="Manage all tools"
        >
          <MoreVertical className="w-5 h-5 text-gray-300" />
        </button>

        {/* Tool Slots */}
        {Array(6)
          .fill(null)
          .map((_, index) => {
            const tool = activeToolSlots[index]

            return (
              <div key={index} className="relative">
                <button
                  onClick={() => handleSlotClick(index)}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all relative ${
                    tool
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-900 border-2 border-dashed border-gray-600 hover:border-cyan-400'
                  }`}
                  title={tool ? tool.name : 'Add Tool'}
                >
                  {tool ? tool.icon : <Plus className="w-4 h-4 text-gray-500" />}
                </button>
              </div>
            )
          })}
      </div>

      {/* Desktop Modals */}
      {showManageModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[9997]"
            onClick={() => setShowManageModal(false)}
          />

          <div
            className="manage-tools-modal fixed left-20 top-20 z-[9998] w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-medium text-gray-300">Manage Tools</h3>
              </div>
              <button
                onClick={() => setShowManageModal(false)}
                className="text-gray-400 hover:text-gray-300 p-1 rounded hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {Array(6)
                .fill(null)
                .map((_, index) => {
                  const tool = activeToolSlots[index]

                  return (
                    <div
                      key={index}
                      className="p-3 rounded-lg border bg-gray-700/50 border-gray-600"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Slot {index + 1}</span>
                      </div>

                      {tool ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="text-white">{tool.icon}</div>
                            <span className="text-sm text-gray-300">{tool.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleChangeTool(index)}
                              className="p-1.5 text-cyan-400 hover:bg-gray-700 rounded transition"
                              title="Change tool"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleRemoveTool(index)}
                              className="p-1.5 text-red-400 hover:bg-gray-700 rounded transition"
                              title="Remove tool"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddTool(index)}
                          className="w-full px-3 py-2 bg-gray-600 hover:bg-gray-500 text-gray-300 rounded text-sm transition flex items-center justify-center gap-2"
                        >
                          <Plus className="w-3 h-3" />
                          Add Tool
                        </button>
                      )}
                    </div>
                  )
                })}
            </div>

            <div className="p-4 border-t border-gray-700 bg-gray-900/50">
              <div className="text-xs text-gray-400 text-center">
                <span className="text-green-400">All 6 slots available</span>
              </div>
            </div>
          </div>
        </>
      )}

      {isSelectingTool !== null && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[9997]"
            onClick={() => setIsSelectingTool(null)}
          />

          <div
            className="tool-selector-modal fixed left-20 top-20 z-[9998] w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-[70vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-sm font-medium text-gray-300">
                Select Tool for Slot {isSelectingTool + 1}
              </h3>
              <button
                onClick={() => setIsSelectingTool(null)}
                className="text-gray-400 hover:text-gray-300 p-1 rounded hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {getAvailableToolsForSlot().length > 0 ? (
                  getAvailableToolsForSlot().map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        handleToolSelect(tool, isSelectingTool)
                        setIsSelectingTool(null)
                      }}
                      className="w-full text-left p-3 rounded hover:bg-gray-700 flex items-center gap-3 text-gray-300 transition"
                    >
                      <div className="flex-shrink-0">{tool.icon}</div>
                      <span className="text-sm">{tool.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm text-center py-4">
                    All available tools are already added
                  </div>
                )}

                {activeToolSlots[isSelectingTool] && (
                  <>
                    <div className="border-t border-gray-700 my-2"></div>
                    <button
                      onClick={() => {
                        handleRemoveTool(isSelectingTool)
                        setIsSelectingTool(null)
                      }}
                      className="w-full text-left p-3 rounded hover:bg-red-600/20 flex items-center gap-3 text-red-400 transition"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-sm">Remove Tool</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}