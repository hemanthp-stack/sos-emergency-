import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';

export default function StealthCalculator({ onTriggerSilentSOS, onExitStealth }) {
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState(null);
  const [operation, setOperation] = useState(null);
  const [clearNext, setClearNext] = useState(false);
  const [secretTriggered, setSecretTriggered] = useState(false);
  const [acHoldProgress, setAcHoldProgress] = useState(0);

  const handleNum = (n) => {
    if (display === '0' || clearNext) {
      setDisplay(String(n));
      setClearNext(false);
    } else {
      if (display.length < 9) {
        setDisplay(display + n);
      }
    }
  };

  const handleOp = (op) => {
    setPrevVal(parseFloat(display));
    setOperation(op);
    setClearNext(true);
  };

  const handleEqual = () => {
    // Secret backdoor trigger: 911 or 999
    if (display === '911' || display === '999') {
      fireStealthSOS();
      setDisplay('Error');
      return;
    }

    if (operation && prevVal !== null) {
      const current = parseFloat(display);
      let result = 0;
      switch (operation) {
        case '+': result = prevVal + current; break;
        case '-': result = prevVal - current; break;
        case '×': result = prevVal * current; break;
        case '÷': result = current !== 0 ? prevVal / current : 'Error'; break;
        default: result = current;
      }
      setDisplay(String(Number(result.toFixed(6))));
      setPrevVal(null);
      setOperation(null);
      setClearNext(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevVal(null);
    setOperation(null);
    setClearNext(false);
  };

  const fireStealthSOS = () => {
    setSecretTriggered(true);
    onTriggerSilentSOS({
      silent: true,
      triggerType: 'stealth_pin',
      reason: 'Discreet Stealth Calculator Trigger'
    });

    setTimeout(() => {
      setSecretTriggered(false);
    }, 1500);
  };

  let holdTimer = null;
  const startAcHold = () => {
    let progress = 0;
    holdTimer = setInterval(() => {
      progress += 20;
      setAcHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(holdTimer);
        fireStealthSOS();
        setAcHoldProgress(0);
      }
    }, 100);
  };

  const endAcHold = () => {
    if (holdTimer) clearInterval(holdTimer);
    setAcHoldProgress(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4 select-none font-sans">
      <div className="w-full max-w-xs bg-black rounded-3xl p-5 border border-zinc-900 shadow-2xl relative">
        {/* Top bar with invisible / subtle indicators */}
        <div className="flex justify-between items-center mb-4 text-xs text-zinc-600 px-2">
          <div className="flex items-center space-x-2">
            <span>DEG</span>
            {secretTriggered && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Silent Beacon Sent"></span>
            )}
          </div>
          <button
            onClick={onExitStealth}
            className="text-zinc-600 hover:text-zinc-400 p-1 flex items-center space-x-1"
            title="Exit Camouflage"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Calculator Display */}
        <div className="h-24 flex items-end justify-end px-3 py-2 mb-4 bg-zinc-950 rounded-2xl border border-zinc-900 text-right">
          <span className="text-5xl font-light text-white tracking-tight overflow-hidden text-ellipsis">
            {display}
          </span>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-2.5">
          {/* Row 1 */}
          <button
            onMouseDown={startAcHold}
            onMouseUp={endAcHold}
            onTouchStart={startAcHold}
            onTouchEnd={endAcHold}
            onClick={handleClear}
            className="relative h-16 rounded-full bg-zinc-700 text-white font-medium text-lg hover:bg-zinc-600 active:scale-95 transition-all overflow-hidden"
          >
            {acHoldProgress > 0 && (
              <div
                className="absolute inset-0 bg-red-800 opacity-60 transition-all duration-100"
                style={{ width: `${acHoldProgress}%` }}
              />
            )}
            <span className="relative z-10">AC</span>
          </button>

          <button
            onClick={() => setDisplay(String(-parseFloat(display)))}
            className="h-16 rounded-full bg-zinc-700 text-white font-medium text-lg hover:bg-zinc-600 active:scale-95 transition-all"
          >
            ±
          </button>

          <button
            onClick={() => setDisplay(String(parseFloat(display) / 100))}
            className="h-16 rounded-full bg-zinc-700 text-white font-medium text-lg hover:bg-zinc-600 active:scale-95 transition-all"
          >
            %
          </button>

          <button
            onClick={() => handleOp('÷')}
            className="h-16 rounded-full bg-amber-500 text-white font-medium text-2xl hover:bg-amber-400 active:scale-95 transition-all"
          >
            ÷
          </button>

          {/* Row 2 */}
          <button onClick={() => handleNum(7)} className="h-16 rounded-full bg-zinc-800 text-white font-medium text-xl hover:bg-zinc-700 active:scale-95 transition-all">7</button>
          <button onClick={() => handleNum(8)} className="h-16 rounded-full bg-zinc-800 text-white font-medium text-xl hover:bg-zinc-700 active:scale-95 transition-all">8</button>
          <button onClick={() => handleNum(9)} className="h-16 rounded-full bg-zinc-800 text-white font-medium text-xl hover:bg-zinc-700 active:scale-95 transition-all">9</button>
          <button onClick={() => handleOp('×')} className="h-16 rounded-full bg-amber-500 text-white font-medium text-2xl hover:bg-amber-400 active:scale-95 transition-all">×</button>

          {/* Row 3 */}
          <button onClick={() => handleNum(4)} className="h-16 rounded-full bg-zinc-800 text-white font-medium text-xl hover:bg-zinc-700 active:scale-95 transition-all">4</button>
          <button onClick={() => handleNum(5)} className="h-16 rounded-full bg-zinc-800 text-white font-medium text-xl hover:bg-zinc-700 active:scale-95 transition-all">5</button>
          <button onClick={() => handleNum(6)} className="h-16 rounded-full bg-zinc-800 text-white font-medium text-xl hover:bg-zinc-700 active:scale-95 transition-all">6</button>
          <button onClick={() => handleOp('-')} className="h-16 rounded-full bg-amber-500 text-white font-medium text-2xl hover:bg-amber-400 active:scale-95 transition-all">-</button>

          {/* Row 4 */}
          <button onClick={() => handleNum(1)} className="h-16 rounded-full bg-zinc-800 text-white font-medium text-xl hover:bg-zinc-700 active:scale-95 transition-all">1</button>
          <button onClick={() => handleNum(2)} className="h-16 rounded-full bg-zinc-800 text-white font-medium text-xl hover:bg-zinc-700 active:scale-95 transition-all">2</button>
          <button onClick={() => handleNum(3)} className="h-16 rounded-full bg-zinc-800 text-white font-medium text-xl hover:bg-zinc-700 active:scale-95 transition-all">3</button>
          <button onClick={() => handleOp('+')} className="h-16 rounded-full bg-amber-500 text-white font-medium text-2xl hover:bg-amber-400 active:scale-95 transition-all">+</button>

          {/* Row 5 */}
          <button onClick={() => handleNum(0)} className="col-span-2 h-16 rounded-full bg-zinc-800 text-white font-medium text-xl hover:bg-zinc-700 text-left pl-7 active:scale-95 transition-all">0</button>
          <button onClick={() => !display.includes('.') && setDisplay(display + '.')} className="h-16 rounded-full bg-zinc-800 text-white font-medium text-xl hover:bg-zinc-700 active:scale-95 transition-all">.</button>
          <button onClick={handleEqual} className="h-16 rounded-full bg-amber-500 text-white font-medium text-2xl hover:bg-amber-400 active:scale-95 transition-all">=</button>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-900 text-center text-[10px] text-zinc-700">
          Tip: Type <span className="text-zinc-500 font-mono">911 =</span> or hold <span className="text-zinc-500 font-mono">AC</span> to trigger silent alert.
        </div>
      </div>
    </div>
  );
}
