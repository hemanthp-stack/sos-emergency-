import React, { useState } from 'react';
import { CheckSquare, Square, Plus, Trash2, ArrowLeft, MoreVertical, X } from 'lucide-react';

export default function StealthNotes({ onTriggerSilentSOS, onExitStealth }) {
  const [title, setTitle] = useState('Daily Groceries & Tasks');
  const [items, setItems] = useState([
    { id: 1, text: 'Organic whole milk (1 gal)', checked: true },
    { id: 2, text: 'Multivitamins & Omega-3', checked: false },
    { id: 3, text: 'Pick up dry cleaning before 6 PM', checked: false },
    { id: 4, text: 'Return statistics textbooks', checked: false },
    { id: 5, text: 'Fresh sourdough bread', checked: true },
  ]);
  const [newItem, setNewItem] = useState('');
  const [secretTriggered, setSecretTriggered] = useState(false);
  const [titleTapCount, setTitleTapCount] = useState(0);

  const toggleCheck = (id) => {
    setItems(items.map(it => it.id === id ? { ...it, checked: !it.checked } : it));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    // Secret backdoor trigger
    if (newItem.includes('911') || newItem.toLowerCase().includes('sos')) {
      fireStealthSOS();
      setNewItem('');
      return;
    }

    setItems([...items, { id: Date.now(), text: newItem, checked: false }]);
    setNewItem('');
  };

  const handleTitleClick = () => {
    const nextCount = titleTapCount + 1;
    setTitleTapCount(nextCount);
    if (nextCount >= 3) {
      fireStealthSOS();
      setTitleTapCount(0);
    }
    setTimeout(() => setTitleTapCount(0), 1200);
  };

  const fireStealthSOS = () => {
    setSecretTriggered(true);
    onTriggerSilentSOS({
      silent: true,
      triggerType: 'stealth_pin',
      reason: 'Discreet Notes Camouflage Trigger'
    });
    setTimeout(() => setSecretTriggered(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1C1E] text-white flex flex-col font-sans select-none">
      {/* Top Notes Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-[#1C1C1E]">
        <div className="flex items-center space-x-3">
          <button onClick={onExitStealth} className="text-amber-400 flex items-center space-x-1 text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Notes</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {secretTriggered && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          )}
          <button onClick={onExitStealth} className="text-zinc-500 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Note Body */}
      <div className="flex-1 max-w-lg mx-auto w-full p-5 overflow-y-auto">
        <div onClick={handleTitleClick} className="cursor-pointer">
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.includes('911')) fireStealthSOS();
            }}
            className="w-full bg-transparent text-2xl font-bold text-white focus:outline-none mb-4"
          />
        </div>

        <p className="text-xs text-zinc-500 mb-6">
          Edited today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 5 items
        </p>

        {/* Checklist */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className="flex items-center space-x-3 cursor-pointer py-1 text-sm text-zinc-300 hover:text-white group"
            >
              {item.checked ? (
                <CheckSquare className="w-5 h-5 text-amber-500 shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-zinc-600 shrink-0 group-hover:text-zinc-400" />
              )}
              <span className={item.checked ? 'line-through text-zinc-500' : ''}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Add item input */}
        <form onSubmit={handleAddItem} className="mt-6 flex items-center space-x-2 pt-4 border-t border-zinc-800">
          <Plus className="w-4 h-4 text-amber-500" />
          <input
            type="text"
            placeholder="Add new list item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none"
          />
        </form>

        <div className="mt-12 text-center text-[11px] text-zinc-700">
          Tap title 3 times or type 911 in note to dispatch silent beacon.
        </div>
      </div>
    </div>
  );
}
