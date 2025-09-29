// app/tools/pdf-tools/components/ToolPanel.tsx
import { Tool } from '../types';
import { useEffect } from 'react';
import { 
  Plus, X, Lock, CheckCircle, CreditCard, Settings2
} from 'lucide-react';

interface ToolPanelProps {
  isMobile: boolean;
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  activeToolSlots: (Tool | null)[];
  handleSlotClick: (index: number) => void;
  isPremium: boolean;
  isLoadingPayment: boolean;
  showLicenseStatus: () => void;
  setShowUpgradeModal: (show: boolean) => void;
  isSelectingTool: number | null;
  setIsSelectingTool: (index: number | null) => void;
  availableTools: Tool[];
  handleToolSelect: (tool: Tool, slotIndex: number) => void;
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
  handleToolSelect
}: ToolPanelProps) {
  const MAX_FREE_SLOTS = 3;
  
  // Handle body scroll lock when tool selector is open
  useEffect(() => {
    if (isSelectingTool !== null) {
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      
      // Handle click outside
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        // Check if click is outside the tool selector
        if (!target.closest('.tool-selector-modal')) {
          setIsSelectingTool(null);
        }
      };
      
      // Add event listener after a short delay to prevent immediate closing
      const timer = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener('click', handleClickOutside);
        document.body.style.overflow = '';
      };
    } else {
      // Re-enable body scroll
      document.body.style.overflow = '';
    }
  }, [isSelectingTool, setIsSelectingTool]);
  
  // Filter out already selected tools
  const getAvailableToolsForSlot = () => {
    const selectedToolIds = activeToolSlots
      .filter(tool => tool !== null)
      .map(tool => tool!.id);
    
    return availableTools.filter(tool => !selectedToolIds.includes(tool.id));
  };
  
  return (
    <div className={`${isMobile ? (showMobileMenu ? 'fixed inset-0 z-50 bg-gray-800' : 'hidden') : 'w-16'} bg-gray-800 border-r border-gray-700 flex flex-col`}>
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
        <div className="text-center mb-2">
          <div className="text-xs text-gray-500">
            {isPremium ? (
              <span className="text-green-400">Premium ✓</span>
            ) : (
              <span>Free (3/6)</span>
            )}
          </div>
        </div>
        
        {Array(6).fill(null).map((_, index) => {
          const tool = activeToolSlots[index];
          const isLocked = index >= MAX_FREE_SLOTS && !isPremium;
          
          return (
            <div key={index} className="relative group">
              <button
                onClick={() => handleSlotClick(index)}
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all relative ${
                  isLocked 
                    ? 'bg-gray-900 border border-gray-700 cursor-pointer hover:border-amber-500/50'
                    : tool 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-900 border-2 border-dashed border-gray-600 hover:border-cyan-400'
                }`}
                title={isLocked ? 'Unlock with Premium' : (tool ? tool.name : 'Add Tool')}
              >
                {isLocked ? (
                  <Lock className="w-4 h-4 text-gray-600" />
                ) : (
                  tool ? tool.icon : <Plus className="w-4 h-4 text-gray-500" />
                )}
                {index === 2 && !isPremium && (
                  <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                )}
              </button>
              
              {/* Change tool button - only show for slots with tools and not locked */}
              {tool && !isLocked && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSelectingTool(index);
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-600 border border-gray-600"
                  title="Change tool"
                >
                  <Settings2 className="w-3 h-3 text-gray-300" />
                </button>
              )}
            </div>
          );
        })}
        
        <button
          onClick={isPremium ? showLicenseStatus : () => setShowUpgradeModal(true)}
          className={`w-12 py-2 rounded-lg text-xs transition flex flex-col items-center justify-center ${
            isPremium
              ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700'
          }`}
          disabled={isLoadingPayment}
        >
          {isLoadingPayment ? (
            '...'
          ) : isPremium ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <>
              <CreditCard className="w-4 h-4 mb-0.5" />
              <span className="text-[10px]">PRO</span>
            </>
          )}
        </button>
      </div>

{isSelectingTool !== null && (
  <>
    {/* Backdrop for mobile */}
    {isMobile && (
      <div 
        className="fixed inset-0 bg-black/50 z-[9997]"
        onClick={() => setIsSelectingTool(null)}
      />
    )}
    
    {/* Tool selector modal - トップ位置を調整 */}
    <div 
      className={`tool-selector-modal fixed ${
        isMobile 
          ? 'inset-x-4 top-1/2 -translate-y-1/2' 
          : 'left-20 top-20'  // top-2 から top-20 に変更（ヘッダー分下げる）
      } z-[9998] w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-[70vh] overflow-hidden flex flex-col`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ヘッダー部分を固定 */}
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
      
      {/* スクロール可能なコンテンツ */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {getAvailableToolsForSlot().length > 0 ? (
            getAvailableToolsForSlot().map(tool => (
              <button
                key={tool.id}
                onClick={() => {
                  handleToolSelect(tool, isSelectingTool);
                  setIsSelectingTool(null);
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
          
          {/* Remove tool option */}
          {activeToolSlots[isSelectingTool] && (
            <>
              <div className="border-t border-gray-700 my-2"></div>
              <button
                onClick={() => {
                  const newSlots = [...activeToolSlots];
                  newSlots[isSelectingTool] = null;
                  handleToolSelect(null as any, isSelectingTool);
                  setIsSelectingTool(null);
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
  );
}