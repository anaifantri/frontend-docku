import React, { useRef, useState } from "react";
import HoverVideoPlayer from "react-hover-video-player";
import BtnPlayVideo from "@/components/BtnPlayVideo";
import BtnEdit from "@/components/BtnEdit";
import BtnDelete from "@/components/BtnDelete";
import BtnShow from "@/components/BtnShow";
import Svg from "@/Components/Svg";
import SpinSvg from "@/Assets/Svg/SpinSvg";
import FormattedDateLong from "@/Utils/FormattedDateLong";

const VideoCard = ({
  title,
  videoUrl,
  thumbnailUrl,
  action,
  url,
  getId,
  token,
  date,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(null);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        // Mencegah error autoplaya blocking dari browser
        console.log("Autoplay diblokir oleh browser:", error);
      });
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      setDuration(videoDuration);
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden w-72 cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative w-full bg-black pt-[56.25%]">
          <video
            ref={videoRef}
            src={videoUrl}
            poster={thumbnailUrl}
            muted
            loop
            onLoadedData={() => setIsLoading(false)}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          {!isLoading && videoRef.current && (
            <>
              <span className="absolute bottom-2 right-2 bg-black py-1 px-3 rounded-md text-white">
                {videoRef.current.duration.toFixed(2)}
              </span>
              <div className="flex justify-center w-full absolute top-[43.25%] py-1 px-3 rounded-md text-white">
                <BtnPlayVideo action={action} />
              </div>
            </>
          )}
          {isLoading && (
            <div className="flex justify-center w-full absolute top-[43.25%] py-1 px-3 rounded-md text-white">
              <Svg title="Back" c={"w-5 fill-current mx-1 animate-spin"}>
                <SpinSvg />
              </Svg>
            </div>
          )}
        </div>
        <div className="bg-black p-1">
          <h3 className="text-white text-center font-semibold text-md">
            {title}
          </h3>
          <h3 className="text-white text-center font-semibold text-md">
            Tanggal : {FormattedDateLong(date)}
          </h3>
        </div>
      </div>
      <div className="flex-all-center p-1">
        <BtnShow showUrl={`/dashboard${url}/${getId}`} />
        <BtnEdit editUrl={`/dashboard${url}/edit/${getId}`} />
        <BtnDelete
          deleteUrl={`/api${url}/destroy/`}
          deleteId={getId}
          getToken={token}
          returnUrl={`/dashboard${url}`}
        />
      </div>
    </>
  );
};

export default VideoCard;
