// app/tools/pdf-tools/components/ToolPanel.tsx
import { Tool } from '../types'
import { useEffect, useState } from 'react'
import {
  Plus,
  X,
  Lock,
  CheckCircle,
  CreditCard,
  MoreVertical,
  Edit3,
  Trash2,
  Settings,
} from 'lucide-react'

interface ToolPanelProps {
  isMobile: boolean
  showMobileMenu: boolean
  setShowMobileMenu: (show: boolean) => void
  activeToolSlots: (Tool | null)[]
  handleSlotClick: (index: number) => void
  isPremium: boolean
  isLoadingPayment: boolean
  showLicenseStatus: () => void
  setShowUpgradeModal: (show: boolean) => void
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
  isPremium,
  isLoadingPayment,
  showLicenseStatus,
  setShowUpgradeModal,
  isSelectingTool,
  setIsSelectingTool,
  availableTools,
  handleToolSelect,
}: ToolPanelProps) {
  const MAX_FREE_SLOTS = 3
  const [showManageModal, setShowManageModal] = useState(false)

  // Handle body scroll lock when tool selector is open
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

  // Filter out already selected tools
  const getAvailableToolsForSlot = () => {
    const selectedToolIds = activeToolSlots.filter((tool) => tool !== null).map((tool) => tool!.id)

    return availableTools.filter((tool) => !selectedToolIds.includes(tool.id))
  }

  const handleRemoveTool = (index: number) => {
    const newSlots = [...activeToolSlots]
    newSlots[index] = null
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

  return (
    <div
      className={`${isMobile ? (showMobileMenu ? 'fixed inset-0 z-50 bg-gray-800' : 'hidden') : 'w-16'} bg-gray-800 border-r border-gray-700 flex flex-col`}
    >
      {isMobile && showMobileMenu && (
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-white font-medium">Tools</h3>
          <button
            onClick={() => setShowMobileMenu(false)}
            className="p-1 rounded hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      )}

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
            const isLocked = index >= MAX_FREE_SLOTS && !isPremium

            return (
              <div key={index} className="relative">
                <button
                  onClick={() => handleSlotClick(index)}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all relative ${
                    isLocked
                      ? 'bg-gray-900 border border-gray-700 cursor-pointer hover:border-amber-500/50'
                      : tool
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-900 border-2 border-dashed border-gray-600 hover:border-cyan-400'
                  }`}
                  title={isLocked ? 'Unlock with Premium' : tool ? tool.name : 'Add Tool'}
                >
                  {isLocked ? (
                    <Lock className="w-4 h-4 text-gray-600" />
                  ) : tool ? (
                    tool.icon
                  ) : (
                    <Plus className="w-4 h-4 text-gray-500" />
                  )}
                  {index === 2 && !isPremium && (
                    <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                  )}
                </button>
              </div>
            )
          })}
      </div>

      {/* Manage Tools Modal */}
      {showManageModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[9997]"
            onClick={() => setShowManageModal(false)}
          />

          <div
            className={`manage-tools-modal fixed ${
              isMobile ? 'inset-x-4 top-1/2 -translate-y-1/2' : 'left-20 top-20'
            } z-[9998] w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-[80vh] overflow-hidden flex flex-col`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
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

            {/* Slots List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {Array(6)
                .fill(null)
                .map((_, index) => {
                  const tool = activeToolSlots[index]
                  const isLocked = index >= MAX_FREE_SLOTS && !isPremium

                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        isLocked ? 'bg-gray-900 border-gray-700' : 'bg-gray-700/50 border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Slot {index + 1}</span>
                        {isLocked && <Lock className="w-3 h-3 text-gray-600" />}
                      </div>

                      {isLocked ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Locked</span>
                          <button
                            onClick={() => {
                              setShowManageModal(false)
                              setShowUpgradeModal(true)
                            }}
                            className="px-3 py-1 text-xs bg-amber-500 text-white rounded hover:bg-amber-600 transition"
                          >
                            Upgrade
                          </button>
                        </div>
                      ) : tool ? (
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

            {/* Footer */}
            <div className="p-4 border-t border-gray-700 bg-gray-900/50">
              <div className="text-xs text-gray-400 text-center">
                {isPremium ? (
                  <span className="text-green-400">✓ Premium: 6 slots unlocked</span>
                ) : (
                  <span>Free: 3 of 6 slots available</span>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tool Selector Modal */}
      {isSelectingTool !== null && (
        <>
          {isMobile && (
            <div
              className="fixed inset-0 bg-black/50 z-[9997]"
              onClick={() => setIsSelectingTool(null)}
            />
          )}

          <div
            className={`tool-selector-modal fixed ${
              isMobile ? 'inset-x-4 top-1/2 -translate-y-1/2' : 'left-20 top-20'
            } z-[9998] w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-[70vh] overflow-hidden flex flex-col`}
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
