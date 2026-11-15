import React, { useState } from 'react';
import { useCareNest } from '../context/CareNestContext';
import {
  Lock,
  Unlock,
  X,
  KeyRound,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { StorageService } from '../services/storageService';

export default function PasscodeModal() {
  const {
    isPasscodeModalOpen,
    setIsPasscodeModalOpen,
    passcodeSuccessCallback
  } = useCareNest();

  const [enteredPin, setEnteredPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  if (!isPasscodeModalOpen) return null;

  const handleDigitClick = (digit) => {
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);
      setErrorMsg('');

      // Auto submit on 4th digit
      if (nextPin.length === 4) {
        verify(nextPin);
      }
    }
  };

  const handleDeleteDigit = () => {
    setEnteredPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setEnteredPin('');
    setErrorMsg('');
  };

  const verify = (pin) => {
    const isValid = StorageService.verifyPasscode(pin);
    if (isValid) {
      setIsPasscodeModalOpen(false);
      setEnteredPin('');
      setErrorMsg('');
      if (passcodeSuccessCallback) {
        passcodeSuccessCallback();
      }
    } else {
      setIsShaking(true);
      setErrorMsg('Incorrect PIN. Please try again.');
      setTimeout(() => {
        setIsShaking(false);
        setEnteredPin('');
      }, 700);
    }
  };

  const currentPin = StorageService.getPasscode();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in">
      <div
        className={`bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-soft-xl border border-stone-200 text-center transition-all ${
          isShaking ? 'animate-bounce border-coral-400' : ''
        }`}
      >
        <div className="flex justify-end">
          <button
            onClick={() => {
              setIsPasscodeModalOpen(false);
              setEnteredPin('');
            }}
            className="p-1 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-sage-100 text-sage-700 flex items-center justify-center mx-auto mb-3 shadow-sm">
          <KeyRound className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-extrabold text-stone-900">Security Verification</h3>
        <p className="text-xs text-stone-500 mt-1 font-medium">
          Enter Eleanor's 4-digit care passcode to proceed
        </p>

        {/* PIN Dots Indicator */}
        <div className="flex items-center justify-center gap-4 my-6">
          {[0, 1, 2, 3].map((index) => {
            const hasDigit = enteredPin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  hasDigit
                    ? 'bg-sage-600 border-sage-600 scale-125 shadow-sm'
                    : 'border-stone-300 bg-stone-100'
                }`}
              />
            );
          })}
        </div>

        {errorMsg && (
          <p className="text-xs font-bold text-coral-600 mb-4 animate-in fade-in">
            {errorMsg}
          </p>
        )}

        {/* Large Accessible Number Pad */}
        <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigitClick(digit.toString())}
              className="h-14 rounded-2xl bg-stone-50 hover:bg-sage-100 active:scale-95 text-stone-800 font-extrabold text-xl shadow-soft-sm border border-stone-200/80 transition-all flex items-center justify-center"
            >
              {digit}
            </button>
          ))}

          <button
            type="button"
            onClick={handleClear}
            className="h-14 rounded-2xl bg-stone-50 hover:bg-stone-200 active:scale-95 text-stone-500 font-bold text-xs shadow-soft-sm border border-stone-200/80 transition-all flex items-center justify-center"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={() => handleDigitClick('0')}
            className="h-14 rounded-2xl bg-stone-50 hover:bg-sage-100 active:scale-95 text-stone-800 font-extrabold text-xl shadow-soft-sm border border-stone-200/80 transition-all flex items-center justify-center"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleDeleteDigit}
            className="h-14 rounded-2xl bg-stone-50 hover:bg-stone-200 active:scale-95 text-stone-500 font-bold text-xs shadow-soft-sm border border-stone-200/80 transition-all flex items-center justify-center"
          >
            Delete
          </button>
        </div>

        {/* Default Demo Helper */}
        <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-stone-400">
          <p>
            Demo Passcode is: <strong className="text-sage-700 font-mono font-bold">{currentPin}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
