'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface NodePos {
  id: string;
  label: string;
  x: number;
  y: number;
  r: number;
  color: string;
  stroke: string;
  hasPulse?: boolean;
}

const VIEW_W = 500;
const VIEW_H = 430;

export default function InteractiveGraph() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [nodes, setNodes] = useState<NodePos[]>([
    { id: 'mcp', label: 'MCP Tool Executors', x: 250, y: 205, r: 28, color: '#9AA3B0', stroke: 'rgba(107,118,133,0.5)', hasPulse: true },
    { id: 'router', label: 'Supervisor Router', x: 125, y: 85, r: 22, color: '#F0B87E', stroke: 'rgba(217,138,74,0.4)' },
    { id: 'eval', label: 'Reflection & Guardrails', x: 375, y: 85, r: 20, color: '#9AA3B0', stroke: 'rgba(107,118,133,0.35)' },
    { id: 'hitl', label: 'Human-in-the-Loop', x: 125, y: 335, r: 22, color: '#F0B87E', stroke: 'rgba(217,138,74,0.4)' },
    { id: 'checkpointer', label: 'State Checkpointer', x: 375, y: 335, r: 22, color: '#F0B87E', stroke: 'rgba(217,138,74,0.4)' },
  ]);

  const activeNodeRef = useRef<string | null>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const getSvgCoords = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    return pt.matrixTransform(ctm.inverse());
  }, []);

  // Global window event listeners so node dragging never detaches
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const currentActive = activeNodeRef.current;
      if (!currentActive) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const svgPoint = getSvgCoords(clientX, clientY);
      if (!svgPoint) return;

      const rawX = svgPoint.x - offsetRef.current.x;
      const rawY = svgPoint.y - offsetRef.current.y;

      setNodes(prev => {
        const targetNode = prev.find(n => n.id === currentActive);
        if (!targetNode) return prev;

        // Label half-width safety padding (JetBrains Mono 11px monospace ~ 6.8px per char)
        const labelHalfWidth = Math.max(targetNode.label.length * 3.5, targetNode.r);
        const minX = labelHalfWidth + 10;
        const maxX = VIEW_W - labelHalfWidth - 10;
        const minY = targetNode.r + 10;
        const maxY = VIEW_H - targetNode.r - 28;

        const clampedX = Math.max(minX, Math.min(rawX, maxX));
        const clampedY = Math.max(minY, Math.min(rawY, maxY));
        return prev.map(n => (n.id === currentActive ? { ...n, x: clampedX, y: clampedY } : n));
      });
    };

    const handleEnd = () => {
      activeNodeRef.current = null;
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [getSvgCoords]);

  const handleStart = (id: string, clientX: number, clientY: number) => {
    activeNodeRef.current = id;
    const targetNode = nodes.find(n => n.id === id);
    if (!targetNode) return;

    const svgPoint = getSvgCoords(clientX, clientY);
    if (!svgPoint) return;

    offsetRef.current = {
      x: svgPoint.x - targetNode.x,
      y: svgPoint.y - targetNode.y,
    };
  };

  const getNode = (id: string) => nodes.find(n => n.id === id) || { x: 0, y: 0, r: 20 };

  const router = getNode('router');
  const mcp = getNode('mcp');
  const evalNode = getNode('eval');
  const hitl = getNode('hitl');
  const checkpointer = getNode('checkpointer');

  // Connective Flow Paths with balanced quadratic/cubic curves
  const pathRouterMcp = `M ${router.x} ${router.y} C ${(router.x + mcp.x)/2} ${router.y}, ${(router.x + mcp.x)/2} ${mcp.y}, ${mcp.x} ${mcp.y}`;
  const pathMcpEval = `M ${mcp.x} ${mcp.y} C ${(mcp.x + evalNode.x)/2} ${mcp.y}, ${(mcp.x + evalNode.x)/2} ${evalNode.y}, ${evalNode.x} ${evalNode.y}`;
  const pathEvalMcpCycle = `M ${evalNode.x} ${evalNode.y} C ${evalNode.x + 35} ${(evalNode.y + mcp.y)/2 + 25}, ${mcp.x + 45} ${(evalNode.y + mcp.y)/2 + 25}, ${mcp.x} ${mcp.y}`;
  const pathMcpHitl = `M ${mcp.x} ${mcp.y} C ${(mcp.x + hitl.x)/2} ${mcp.y}, ${(mcp.x + hitl.x)/2} ${hitl.y}, ${hitl.x} ${hitl.y}`;
  const pathMcpCheckpointer = `M ${mcp.x} ${mcp.y} C ${(mcp.x + checkpointer.x)/2} ${mcp.y}, ${(mcp.x + checkpointer.x)/2} ${checkpointer.y}, ${checkpointer.x} ${checkpointer.y}`;
  const pathHitlCheckpointer = `M ${hitl.x} ${hitl.y} C ${(hitl.x + checkpointer.x)/2} ${hitl.y + 20}, ${(hitl.x + checkpointer.x)/2} ${hitl.y + 20}, ${checkpointer.x} ${checkpointer.y}`;
  const pathRouterEval = `M ${router.x} ${router.y} C ${(router.x + evalNode.x)/2} ${router.y - 25}, ${(router.x + evalNode.x)/2} ${evalNode.y - 25}, ${evalNode.x} ${evalNode.y}`;

  return (
    <div className="relative glass-strong rounded-[2rem] p-6 sm:p-8 shadow-glow border border-white/12 select-none overflow-hidden min-h-[520px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="chip text-mute flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-copper" /> live_orchestration.graph
        </span>
        <span className="chip text-emerald-400/80 font-mono text-xs">5 nodes · active</span>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full h-auto select-none touch-none my-auto"
        onContextMenu={(e) => e.preventDefault()}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D98A4A" />
            <stop offset="100%" stopColor="#6B7685" />
          </linearGradient>
        </defs>

        {/* Connective Flow Paths */}
        <path id="path-router-mcp" d={pathRouterMcp} fill="none" stroke="url(#lineGrad)" strokeOpacity="0.55" strokeWidth="1.6" className="flow-path" />
        <path id="path-mcp-eval" d={pathMcpEval} fill="none" stroke="url(#lineGrad)" strokeOpacity="0.55" strokeWidth="1.6" className="flow-path" />
        <path id="path-eval-mcp-cycle" d={pathEvalMcpCycle} fill="none" stroke="url(#lineGrad)" strokeOpacity="0.35" strokeWidth="1.4" strokeDasharray="4 4" className="flow-path" />
        <path id="path-mcp-hitl" d={pathMcpHitl} fill="none" stroke="url(#lineGrad)" strokeOpacity="0.55" strokeWidth="1.6" className="flow-path" />
        <path id="path-mcp-checkpointer" d={pathMcpCheckpointer} fill="none" stroke="url(#lineGrad)" strokeOpacity="0.55" strokeWidth="1.6" className="flow-path" />
        <path id="path-hitl-checkpointer" d={pathHitlCheckpointer} fill="none" stroke="url(#lineGrad)" strokeOpacity="0.35" strokeWidth="1.4" className="flow-path" />
        <path id="path-router-eval" d={pathRouterEval} fill="none" stroke="url(#lineGrad)" strokeOpacity="0.25" strokeWidth="1.2" strokeDasharray="4 4" className="flow-path" />

        {/* Data Packets */}
        <circle r="3.2" fill="#F0B87E" className="packet">
          <animateMotion dur="3.4s" repeatCount="indefinite" path={pathRouterMcp} />
        </circle>
        <circle r="3.2" fill="#9AA3B0" className="packet">
          <animateMotion dur="2.8s" repeatCount="indefinite" path={pathMcpEval} />
        </circle>
        <circle r="2.8" fill="#F0B87E" className="packet">
          <animateMotion dur="3.6s" repeatCount="indefinite" path={pathEvalMcpCycle} />
        </circle>
        <circle r="3.2" fill="#F0B87E" className="packet">
          <animateMotion dur="3.1s" repeatCount="indefinite" path={pathMcpHitl} />
        </circle>
        <circle r="3.2" fill="#F0B87E" className="packet">
          <animateMotion dur="3.0s" repeatCount="indefinite" path={pathMcpCheckpointer} />
        </circle>
        <circle r="2.6" fill="#6B7685" className="packet">
          <animateMotion dur="4.2s" repeatCount="indefinite" path={pathHitlCheckpointer} />
        </circle>

        {/* Nodes */}
        {nodes.map(node => (
          <g
            key={node.id}
            transform={`translate(${node.x},${node.y})`}
            onMouseDown={(e) => handleStart(node.id, e.clientX, e.clientY)}
            onTouchStart={(e) => handleStart(node.id, e.touches[0].clientX, e.touches[0].clientY)}
            className="draggable-node cursor-move touch-none"
          >
            <circle
              r={node.r}
              fill={node.id === 'mcp' ? 'rgba(107,118,133,0.12)' : 'rgba(217,138,74,0.1)'}
              stroke={node.stroke}
              strokeWidth="1"
            />
            {node.hasPulse && (
              <circle
                r={node.r}
                fill="none"
                stroke="#6B7685"
                strokeWidth="1"
                className="pulse-ring"
                style={{ transformOrigin: 'center' }}
              />
            )}
            <circle r={node.id === 'eval' ? 2.8 : (node.id === 'mcp' ? 4 : 3.5)} fill={node.color} />
            <text
              y={node.r + 16}
              textAnchor="middle"
              fill={node.color}
              fontSize="11"
              fontFamily="JetBrains Mono, monospace"
              className="pointer-events-none select-none font-mono"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      <p className="text-xs text-mute2 mt-4 leading-relaxed font-mono">
        A simplified live view of how agents pass context, route tool calls via MCP, and checkpoint state autonomously — the same pattern used across the pipelines below.
      </p>
    </div>
  );
}
