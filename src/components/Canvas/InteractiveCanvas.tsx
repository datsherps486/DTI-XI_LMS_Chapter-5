import React, { useRef, useState, useEffect, useCallback } from 'react';
import { LLNode, ListMode, ListTopology, PointerMarker } from '../../types/linkedList';
import { NodeCard } from './NodeCard';
import { PointerArrow } from './PointerArrow';
import { NullTerminal } from './NullTerminal';
import { soundManager } from '../../utils/audio';
import { ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';

interface InteractiveCanvasProps {
  nodes: LLNode[];
  headId: string | null;
  mode: ListMode;
  topology: ListTopology;
  activePointers: Record<string, string | null>;
  highlightEdge?: { from: string; to: string | null; color?: string } | null;
  onUpdateNodes: (nodes: LLNode[]) => void;
  onUpdateNodeValue: (nodeId: string, val: string | number) => void;
  onSetHead: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onConnectPointers: (fromId: string, toId: string | null, port: 'next' | 'prev') => void;
}

interface LinkingState {
  fromNodeId: string;
  port: 'next' | 'prev';
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

interface DraggingNodeState {
  nodeId: string;
  startX: number;
  startY: number;
  nodeInitialX: number;
  nodeInitialY: number;
}

interface PanState {
  startX: number;
  startY: number;
  initialPanX: number;
  initialPanY: number;
}

const NODE_WIDTH = 160;
const NODE_HEIGHT = 80;

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
  nodes,
  headId,
  mode,
  topology,
  activePointers,
  highlightEdge,
  onUpdateNodes,
  onUpdateNodeValue,
  onSetHead,
  onDeleteNode,
  onConnectPointers,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 40, y: 30 });
  const [isPanMode, setIsPanMode] = useState<boolean>(false);

  const [draggingNode, setDraggingNode] = useState<DraggingNodeState | null>(null);
  const [linkingState, setLinkingState] = useState<LinkingState | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isHoveringNull, setIsHoveringNull] = useState<boolean>(false);
  const [panning, setPanning] = useState<PanState | null>(null);

  // Convert client viewport coordinates to canvas local coordinates
  const getCanvasCoords = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return { x: 0, y: 0 };
      const rect = containerRef.current.getBoundingClientRect();
      return {
        x: (clientX - rect.left - pan.x) / zoom,
        y: (clientY - rect.top - pan.y) / zoom,
      };
    },
    [pan, zoom]
  );

  // Calculate position for the NULL terminal block (to the right of the tail)
  const tailNode = topology.tailId ? nodes.find((n) => n.id === topology.tailId) : null;
  const nullTerminalPos = tailNode
    ? { x: tailNode.x + NODE_WIDTH + 60, y: tailNode.y + 18 }
    : { x: 420, y: 220 };

  // Handle node drag start
  const handleNodeDragStart = (e: React.PointerEvent, nodeId: string) => {
    if (e.button !== 0) return; // primary click only
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    soundManager.playClick();
    const coords = getCanvasCoords(e.clientX, e.clientY);
    setDraggingNode({
      nodeId,
      startX: coords.x,
      startY: coords.y,
      nodeInitialX: node.x,
      nodeInitialY: node.y,
    });
  };

  // Handle start wire connection from port
  const handleStartConnect = (e: React.PointerEvent, nodeId: string, port: 'next' | 'prev') => {
    e.stopPropagation();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const startX = port === 'next' ? node.x + 146 : node.x + 14;
    const startY = node.y + 48;
    const coords = getCanvasCoords(e.clientX, e.clientY);

    setLinkingState({
      fromNodeId: nodeId,
      port,
      startX,
      startY,
      currentX: coords.x,
      currentY: coords.y,
    });
  };

  // Handle background pan start
  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    if (e.target !== containerRef.current && (e.target as HTMLElement).tagName !== 'svg') return;
    if (e.button === 0 || e.button === 1) {
      setPanning({
        startX: e.clientX,
        startY: e.clientY,
        initialPanX: pan.x,
        initialPanY: pan.y,
      });
    }
  };

  // Global pointer move listener during drag
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const coords = getCanvasCoords(e.clientX, e.clientY);

      if (draggingNode) {
        const dx = coords.x - draggingNode.startX;
        const dy = coords.y - draggingNode.startY;

        const updated = nodes.map((n) => {
          if (n.id === draggingNode.nodeId) {
            return {
              ...n,
              x: Math.round(draggingNode.nodeInitialX + dx),
              y: Math.round(draggingNode.nodeInitialY + dy),
            };
          }
          return n;
        });
        onUpdateNodes(updated);
      } else if (linkingState) {
        setLinkingState((prev) =>
          prev
            ? {
                ...prev,
                currentX: coords.x,
                currentY: coords.y,
              }
            : null
        );
      } else if (panning) {
        const dx = e.clientX - panning.startX;
        const dy = e.clientY - panning.startY;
        setPan({
          x: panning.initialPanX + dx,
          y: panning.initialPanY + dy,
        });
      }
    },
    [draggingNode, linkingState, panning, getCanvasCoords, nodes, onUpdateNodes]
  );

  // Global pointer up listener
  const handlePointerUp = useCallback(() => {
    if (draggingNode) {
      setDraggingNode(null);
    }
    if (linkingState) {
      if (isHoveringNull) {
        // Dropped onto NULL terminal
        onConnectPointers(linkingState.fromNodeId, null, linkingState.port);
        soundManager.playConnect();
      } else if (hoveredNodeId) {
        // Dropped onto another node
        onConnectPointers(linkingState.fromNodeId, hoveredNodeId, linkingState.port);
        soundManager.playConnect();
      }
      setLinkingState(null);
    }
    if (panning) {
      setPanning(null);
    }
  }, [draggingNode, linkingState, isHoveringNull, hoveredNodeId, onConnectPointers, panning]);

  // Zoom handlers
  const handleZoom = (delta: number) => {
    soundManager.playClick();
    setZoom((z) => Math.min(1.8, Math.max(0.5, Number((z + delta).toFixed(2)))));
  };

  const handleResetView = () => {
    soundManager.playClick();
    setZoom(1);
    setPan({ x: 40, y: 30 });
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.08 : -0.08;
      setZoom((z) => Math.min(1.8, Math.max(0.5, Number((z + delta).toFixed(2)))));
    }
  };

  // Map pointer markers for each node
  const getNodePointers = (nodeId: string): PointerMarker[] => {
    const list: PointerMarker[] = [];
    Object.entries(activePointers).forEach(([key, id]) => {
      if (id === nodeId && key !== 'HEAD' && key !== 'TAIL') {
        let color = 'text-amber-300';
        let bgColor = 'bg-amber-950/80 border border-amber-600/60';
        if (key === 'slow') {
          color = 'text-orange-300';
          bgColor = 'bg-orange-950/80 border border-orange-600/60';
        } else if (key === 'fast') {
          color = 'text-rose-300';
          bgColor = 'bg-rose-950/80 border border-rose-600/60';
        } else if (key === 'prev') {
          color = 'text-purple-300';
          bgColor = 'bg-purple-950/80 border border-purple-600/60';
        }
        list.push({
          id: key,
          name: key,
          nodeId,
          color,
          bgColor,
          label: key,
        });
      }
    });
    return list;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handleCanvasPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      className={`relative w-full h-full min-h-[520px] bg-slate-950 canvas-grid overflow-hidden select-none border border-slate-800 rounded-xl ${
        isPanMode || panning ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      }`}
    >
      {/* Floating Canvas Controls */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-lg shadow-lg backdrop-blur">
        <button
          onClick={() => handleZoom(0.1)}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-[11px] font-mono font-medium text-slate-400 px-1 tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => handleZoom(-0.1)}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-800 mx-0.5" />
        <button
          onClick={() => setIsPanMode(!isPanMode)}
          className={`p-1.5 rounded transition-colors ${
            isPanMode ? 'text-indigo-400 bg-indigo-500/20' : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Toggle Pan Mode"
        >
          <Move className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Reset Zoom & Pan"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Helper Banner in Bottom Left */}
      <div className="absolute bottom-3 left-3 z-30 flex items-center gap-3 text-xs text-slate-400 bg-slate-900/90 border border-slate-800/80 px-3 py-1.5 rounded-lg backdrop-blur pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span>Drag node to move</span>
        </div>
        <span className="text-slate-600">·</span>
        <span>Drag <span className="font-mono text-sky-300 text-[11px]">next</span> port to connect</span>
        <span className="text-slate-600">·</span>
        <span>Double-click data to edit</span>
      </div>

      {/* Main Scalable & Pannable Transform Layer */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
        className="absolute inset-0 w-[4000px] h-[3000px] pointer-events-none"
      >
        {/* SVG Pointer Arrows Layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-auto"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Standard sky/blue arrowhead */}
            <marker
              id="arrowhead-38bdf8"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
            </marker>

            {/* Amber arrowhead */}
            <marker
              id="arrowhead-f59e0b"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b" />
            </marker>

            {/* Violet arrowhead */}
            <marker
              id="arrowhead-a855f7"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#a855f7" />
            </marker>

            {/* Emerald arrowhead */}
            <marker
              id="arrowhead-10b981"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
            </marker>

            {/* Indigo arrowhead */}
            <marker
              id="arrowhead-6366f1"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#6366f1" />
            </marker>

            {/* Slate arrowhead for NULL */}
            <marker
              id="arrowhead-64748b"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 2 L 6 5 L 0 8 z" fill="#64748b" />
            </marker>
          </defs>

          {/* Render NEXT Pointers */}
          {nodes.map((sourceNode) => {
            if (!sourceNode.nextId) {
              // Arrow pointing to NULL terminal
              const startX = sourceNode.x + 146;
              const startY = sourceNode.y + 48;
              const endX = nullTerminalPos.x;
              const endY = nullTerminalPos.y + 16;

              return (
                <PointerArrow
                  key={`next-null-${sourceNode.id}`}
                  startX={startX}
                  startY={startY}
                  endX={endX}
                  endY={endY}
                  color="#64748b"
                  label=""
                />
              );
            }

            const targetNode = nodes.find((n) => n.id === sourceNode.nextId);
            if (!targetNode) return null;

            const isSelf = sourceNode.id === targetNode.id;
            const isCycle =
              topology.hasCycle &&
              topology.cycleNodeIds.has(sourceNode.id) &&
              topology.cycleNodeIds.has(targetNode.id);

            const startX = sourceNode.x + 146;
            const startY = sourceNode.y + 48;
            const endX = targetNode.x - 4;
            const endY = targetNode.y + 48;

            let color = '#38bdf8';
            if (isCycle) color = '#f59e0b';
            if (highlightEdge && highlightEdge.from === sourceNode.id && highlightEdge.to === targetNode.id) {
              color = highlightEdge.color || '#a855f7';
            }

            return (
              <PointerArrow
                key={`next-${sourceNode.id}-${targetNode.id}`}
                startX={startX}
                startY={startY}
                endX={endX}
                endY={endY}
                color={color}
                isSelfLoop={isSelf}
                isCycle={isCycle && !isSelf}
                label={isCycle ? 'cycle' : undefined}
                onDisconnect={() => {
                  soundManager.playDisconnect();
                  onConnectPointers(sourceNode.id, null, 'next');
                }}
              />
            );
          })}

          {/* Render PREV Pointers (Doubly Linked List mode) */}
          {mode === 'doubly' &&
            nodes.map((sourceNode) => {
              if (!sourceNode.prevId) return null;
              const targetNode = nodes.find((n) => n.id === sourceNode.prevId);
              if (!targetNode) return null;

              // Prev port connects from left of source to right of target
              const startX = sourceNode.x + 14;
              const startY = sourceNode.y + 36;
              const endX = targetNode.x + 146;
              const endY = targetNode.y + 36;

              return (
                <PointerArrow
                  key={`prev-${sourceNode.id}-${targetNode.id}`}
                  startX={startX}
                  startY={startY}
                  endX={endX}
                  endY={endY}
                  color="#a855f7"
                  label="prev"
                  onDisconnect={() => {
                    soundManager.playDisconnect();
                    onConnectPointers(sourceNode.id, null, 'prev');
                  }}
                />
              );
            })}

          {/* Dynamic Wire when currently dragging to connect */}
          {linkingState && (
            <g>
              <line
                x1={linkingState.startX}
                y1={linkingState.startY}
                x2={linkingState.currentX}
                y2={linkingState.currentY}
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeDasharray="4,4"
              />
              <circle
                cx={linkingState.currentX}
                cy={linkingState.currentY}
                r="6"
                fill="#38bdf8"
                className="animate-ping opacity-75"
              />
              <circle
                cx={linkingState.currentX}
                cy={linkingState.currentY}
                r="4"
                fill="#38bdf8"
              />
            </g>
          )}
        </svg>

        {/* Visual NULL Terminal */}
        <NullTerminal
          x={nullTerminalPos.x}
          y={nullTerminalPos.y}
          isDropTarget={isHoveringNull && !!linkingState}
          onHoverTerminal={setIsHoveringNull}
        />

        {/* Node Cards Layer */}
        <div className="absolute inset-0 pointer-events-auto">
          {nodes.map((node) => {
            const isHead = node.id === headId;
            const isTail = node.id === topology.tailId;
            const isCycleNode = topology.cycleNodeIds.has(node.id);
            const isDetached = topology.detachedNodes.some((d) => d.id === node.id);
            const markers = getNodePointers(node.id);

            return (
              <NodeCard
                key={node.id}
                node={node}
                mode={mode}
                isHead={isHead}
                isTail={isTail}
                pointers={markers}
                isCycleNode={isCycleNode}
                isDetached={isDetached}
                onDragStart={handleNodeDragStart}
                onStartConnect={handleStartConnect}
                onUpdateValue={onUpdateNodeValue}
                onSetHead={onSetHead}
                onDeleteNode={onDeleteNode}
                onHoverPort={setHoveredNodeId}
                isSelected={hoveredNodeId === node.id && !!linkingState}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
