import "./spinner.css";

export default function Loader({
  text,
  fullScreen,
}: {
  text?: string;
  fullScreen?: boolean;
}) {
  return (
    <div className={`loaderWrapper ${fullScreen && "h-[60dvh]"}`}>
      <div>
        <div className="spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="text-center text-gray-500 mt-14">{text}</div>
      </div>
    </div>
  );
}
