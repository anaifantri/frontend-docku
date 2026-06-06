import React from "react";
import Svg from "@/components/Svg";
import CloseSvg from "@/assets/Svg/CloseSvg";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6"
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            type="button"
            className="flex-all-center mx-1 text-red-700 hover:text-red-500 cursor-pointer"
            onClick={onClose}
          >
            <Svg title="Scan" c={"w-5 fill-current mx-1"}>
              <CloseSvg />
            </Svg>
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-600">{children}</div>
      </div>
    </div>
  );
}
