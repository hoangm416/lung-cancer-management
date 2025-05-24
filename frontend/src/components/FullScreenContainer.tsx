import React from "react";
import { X } from "lucide-react";
import FullScreen from "../assets/fullscreen.svg";
import { cn } from "@/lib/utils";
import { useFullscreenContext } from "@/context/FullScreenContext";
import { v4 as uuidv4 } from "uuid";

interface FullscreenContainerProps {
  children: React.ReactNode;
  className?: string;
}

const FullscreenContainer: React.FC<FullscreenContainerProps> = ({ children, className }) => {
  const { activeId, setActiveId } = useFullscreenContext();
  const id = React.useMemo(() => uuidv4(), []);
  const isFullscreen = activeId === id;

  const toggleFullscreen = () => {
    if (isFullscreen) {
      setActiveId(null);
    } else {
      setActiveId(id);
    }
  };

  return (
    <div
      className={cn(
        "relative mx-auto w-full h-full rounded-md py-4 px-4 shadow-[0_5px_15px_rgba(149,157,165,0.2)]",
        {
          "fixed inset-0 z-50 w-full h-full max-w-none bg-white p-6 overflow-auto": isFullscreen,
        },
        className
      )}
    >
      <div className="absolute right-4 top-4 flex gap-2 z-50">
        {isFullscreen ? (
          <button
            onClick={toggleFullscreen}
            className="rounded-full bg-gray-200 p-2 hover:bg-gray-300"
            title="Thoát toàn màn hình"
          >
            <X size={20} />
          </button>
        ) : activeId === null ? (
          <button
            onClick={toggleFullscreen}
            className="rounded-full border border-border bg-white p-2 hover:bg-gray-300"
            title="Toàn màn hình"
          >
            <img src={FullScreen} alt="Fullscreen" className="w-5 h-5" />
          </button>
        ) : null}
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
};

export default FullscreenContainer;
