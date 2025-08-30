import React, { useState, useEffect } from 'react';

const NumberInputTest: React.FC = () => {
  const [days, setDays] = useState<number>(1);
  const [weeks, setWeeks] = useState<number>(1);
  const [inputType, setInputType] = useState<'daily' | 'weekly'>('daily');
  const [pickupDate, setPickupDate] = useState<string>('');
  const [returnDate, setReturnDate] = useState<string>('');

  // Auto-calculate return date when pickup date or days/weeks change
  useEffect(() => {
    if (pickupDate) {
      const pickup = new Date(pickupDate);
      const returnCalc = new Date(pickup);
      
      if (inputType === 'daily') {
        returnCalc.setDate(returnCalc.getDate() + days);
      } else {
        returnCalc.setDate(returnCalc.getDate() + (weeks * 7));
      }
      
      setReturnDate(returnCalc.toISOString().split('T')[0]);
    }
  }, [pickupDate, days, weeks, inputType]);

  return (
    <div className="p-6 bg-gray-800 rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold text-white mb-4">🔢 Auto-Calculate Return Date Test</h2>
      
      {/* Booking Type Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Booking Type
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setInputType('daily')}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              inputType === 'daily'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setInputType('weekly')}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              inputType === 'weekly'
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Date Testing for Auto-calculation */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Pickup Date
        </label>
        <input
          type="date"
          value={pickupDate}
          onChange={(e) => setPickupDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Return Date 
          <span className="text-xs text-blue-400 ml-1">(Auto-calculated)</span>
        </label>
        <input
          type="date"
          value={returnDate}
          readOnly
          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-gray-300 cursor-not-allowed"
        />
      </div>

      {/* Number Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {inputType === 'weekly' ? 'Number of Weeks' : 'Number of Days'}
        </label>
        <input
          type="text"
          pattern="[0-9]*"
          inputMode="numeric"
          value={inputType === 'weekly' ? weeks : days}
          onFocus={(e) => {
            // Select all text on focus for easier editing
            e.target.select();
          }}
          onChange={(e) => {
            let value = e.target.value;
            console.log('Input changed:', value);
            
            // Allow empty string during editing
            if (value === '') {
              console.log('Empty value, not updating state yet');
              return;
            }
            
            // Remove non-numeric characters
            value = value.replace(/[^0-9]/g, '');
            console.log('After cleanup:', value);
            
            // If still empty after cleanup, don't update
            if (value === '') {
              return;
            }
            
            // Parse to number and apply limits
            let numValue = parseInt(value);
            const maxValue = inputType === 'weekly' ? 12 : 30;
            
            if (numValue > maxValue) {
              numValue = maxValue;
            }
            if (numValue < 1) {
              numValue = 1;
            }
            
            console.log('Final value:', numValue);
            
            if (inputType === 'weekly') {
              setWeeks(numValue);
            } else {
              setDays(numValue);
            }
          }}
          onBlur={(e) => {
            // If field is empty when user leaves, set to 1
            if (e.target.value === '' || parseInt(e.target.value) < 1) {
              console.log('Field empty on blur, setting to 1');
              if (inputType === 'weekly') {
                setWeeks(1);
              } else {
                setDays(1);
              }
            }
          }}
          onKeyDown={(e) => {
            // Handle backspace - if current value is single digit, clear the field
            if (e.key === 'Backspace') {
              const currentValue = e.currentTarget.value;
              console.log('Backspace pressed, current value:', currentValue);
              if (currentValue.length === 1) {
                console.log('Single digit, clearing field');
                e.preventDefault();
                e.currentTarget.value = '';
                return;
              }
            }
            
            // Allow: backspace, delete, tab, escape, enter
            if ([8, 9, 27, 13, 46].includes(e.keyCode) ||
              // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
              (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode)) ||
              // Allow: home, end, left, right, up, down
              (e.keyCode >= 35 && e.keyCode <= 40)) {
              return;
            }
            
            // Ensure that it is a number (0-9)
            if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
              e.preventDefault();
            }
          }}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors text-white placeholder-gray-400"
          placeholder={inputType === 'weekly' ? 'Enter weeks' : 'Enter days'}
        />
      </div>

      {/* Current Values Display */}
      <div className="p-3 bg-gray-700 rounded border">
        <h3 className="font-semibold text-white mb-2">Current Values:</h3>
        <p className="text-sm text-gray-300">Days: {days}</p>
        <p className="text-sm text-gray-300">Weeks: {weeks}</p>
        <p className="text-sm text-gray-300">Active: {inputType === 'weekly' ? weeks : days} {inputType === 'weekly' ? 'weeks' : 'days'}</p>
        {pickupDate && (
          <>
            <p className="text-sm text-gray-300">Pickup: {new Date(pickupDate).toLocaleDateString()}</p>
            <p className="text-sm text-gray-300">Return: {returnDate ? new Date(returnDate).toLocaleDateString() : 'Not calculated'}</p>
            {returnDate && (
              <p className="text-sm text-blue-400">
                Duration: {Math.ceil((new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
            )}
          </>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/50 rounded">
        <h3 className="font-semibold text-blue-400 mb-2">📱 Enhanced Mobile Editing:</h3>
        <ul className="text-sm text-blue-200 space-y-1">
          <li>• <strong>Touch to Focus:</strong> All text gets selected for easy replacement</li>
          <li>• <strong>One Backspace:</strong> Clears single digits completely (1 → empty → type 2)</li>
          <li>• <strong>Type Directly:</strong> Just type new number to replace</li>
          <li>• <strong>Auto-Fill:</strong> Empty field becomes "1" when you leave it</li>
          <li>• <strong>Numeric Keyboard:</strong> Only number keys work</li>
        </ul>
      </div>

      <div className="mt-4 p-3 bg-green-900/20 border border-green-700/50 rounded">
        <h3 className="font-semibold text-green-400 mb-2">🎯 Try This Auto-Calculation:</h3>
        <ol className="text-sm text-green-200 space-y-1">
          <li>1. Select a pickup date above</li>
          <li>2. Change the number of days/weeks → return date updates automatically</li>
          <li>3. Switch between daily/weekly → see different calculations</li>
          <li>4. For daily: return date = pickup date + number of days</li>
          <li>5. For weekly: return date = pickup date + (weeks × 7 days)</li>
        </ol>
      </div>
    </div>
  );
};

export default NumberInputTest;
