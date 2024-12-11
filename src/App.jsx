import React, { useRef, useState, useEffect } from "react";

const App = () => {
  const canvasRef = useRef(null);
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState(5);
  const [drawing, setDrawing] = useState([]); // To store the drawing paths

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw the saved drawing with the new font size
    drawing.forEach((path) => {
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      path.forEach((point, index) => {
        if (index > 0) {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.strokeStyle = textColor;
      ctx.lineWidth = fontSize;
      ctx.stroke();
    });
  }, [backgroundColor, fontSize, drawing]);

  const handleColorChange = (event) => {
    setTextColor(event.target.value);
  };

  const handleBackgroundColorChange = (event) => {
    setBackgroundColor(event.target.value);
  };

  const handleFontSizeChange = (event) => {
    setFontSize(Number(event.target.value)); // Ensure it's a number
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setDrawing([]); // Clear drawing state
  };

  const handleSaveCanvas = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL();
    localStorage.setItem("canvasContents", dataUrl);

    const link = document.createElement("a");
    link.download = "my-canvas.png";
    link.href = dataUrl;
    link.click();
  };

  const handleRetrieveCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const savedCanvas = localStorage.getItem("canvasContents");

    if (savedCanvas) {
      const img = new Image();
      img.src = savedCanvas;
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
    }
  };

  const handleMouseDown = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    canvas.isDrawing = true;

    // Start a new path
    setDrawing((prevDrawing) => [
      ...prevDrawing,
      [{ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY }],
    ]);
  };

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (canvas.isDrawing) {
      ctx.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      ctx.strokeStyle = textColor;
      ctx.lineWidth = fontSize;
      ctx.stroke();

      // Update drawing state with new point
      setDrawing((prevDrawing) => {
        const newDrawing = [...prevDrawing];
        newDrawing[newDrawing.length - 1].push({
          x: event.nativeEvent.offsetX,
          y: event.nativeEvent.offsetY,
        });
        return newDrawing;
      });
    }
  };

  const handleMouseUp = () => {
    const canvas = canvasRef.current;
    canvas.isDrawing = false;
  };

  return (
    <div className="relative flex flex-col items-center bg-gray-50 p-8 rounded-lg shadow-lg">
      <div className="flex justify-between w-full max-w-xl mb-6">
        <div className="flex flex-col items-start">
          <label className="text-lg font-semibold text-gray-600 mb-2">Text Color</label>
          <input
            className="w-32 h-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="color"
            value={textColor}
            onChange={handleColorChange}
          />
        </div>
        <div className="flex flex-col items-start">
          <label className="text-lg font-semibold text-gray-600 mb-2">Background Color</label>
          <input
            className="w-32 h-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="color"
            value={backgroundColor}
            onChange={handleBackgroundColorChange}
          />
        </div>
        <div className="flex flex-col items-start">
          <label className="text-lg font-semibold text-gray-600 mb-2">Font Size</label>
          <select
            className="w-32 h-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={fontSize}
            onChange={handleFontSizeChange}
          >
            {[2.4, 5, 10, 15, 20, 25, 30, 40, 45].map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={820}
        height={400}
        className="border border-gray-400 rounded-lg shadow-lg mb-6"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>
      <div className="flex justify-between w-full max-w-xl">
        <button
          className="bg-red-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-red-700 transition-colors duration-200"
          onClick={handleClearCanvas}
        >
          Clear
        </button>
        <button
          className="bg-green-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200"
          onClick={handleSaveCanvas}
        >
          Save & Download
        </button>
        <button
          className="bg-yellow-500 text-white font-medium py-2 px-6 rounded-lg hover:bg-yellow-600 transition-colors duration-200"
          onClick={handleRetrieveCanvas}
        >
          Retrieve
        </button>
      </div>
    </div>
  );
};

export default App;
