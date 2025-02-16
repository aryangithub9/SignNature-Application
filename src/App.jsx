import React, { useRef, useState, useEffect } from "react";

const App = () => {
  const canvasRef = useRef(null);
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState(5);
  const [drawing, setDrawing] = useState([]);
  const [canvasWidth, setCanvasWidth] = useState(820); // Dynamic width

  // Adjust canvas width based on screen size
  useEffect(() => {
    const updateCanvasSize = () => {
      setCanvasWidth(window.innerWidth < 768 ? window.innerWidth - 40 : 820);
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw stored paths
    drawing.forEach((path) => {
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      path.forEach((point, index) => {
        if (index > 0) ctx.lineTo(point.x, point.y);
      });
      ctx.strokeStyle = textColor;
      ctx.lineWidth = fontSize;
      ctx.stroke();
    });
  }, [backgroundColor, fontSize, drawing]);

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setDrawing([]);
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
      img.onload = () => ctx.drawImage(img, 0, 0);
    }
  };

  // Drawing Functions (Mouse & Touch)
  const startDrawing = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x, y);
    canvas.isDrawing = true;
    setDrawing((prev) => [...prev, [{ x, y }]]);
  };

  const draw = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (canvas.isDrawing) {
      ctx.lineTo(x, y);
      ctx.strokeStyle = textColor;
      ctx.lineWidth = fontSize;
      ctx.stroke();
      setDrawing((prev) => {
        const newDrawing = [...prev];
        newDrawing[newDrawing.length - 1].push({ x, y });
        return newDrawing;
      });
    }
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    canvas.isDrawing = false;
  };

  // Mouse Events
  const handleMouseDown = (event) => startDrawing(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
  const handleMouseMove = (event) => draw(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
  const handleMouseUp = stopDrawing;

  // Touch Events
  const handleTouchStart = (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    startDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  const handleTouchMove = (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    draw(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  const handleTouchEnd = stopDrawing;

  return (
    <div className="flex flex-col items-center bg-gray-50 p-4 sm:p-8 rounded-lg shadow-lg">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-lg mb-4">
        <div className="flex flex-col">
          <label className="text-sm sm:text-lg font-semibold text-gray-600">Text Color</label>
          <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm sm:text-lg font-semibold text-gray-600">Background</label>
          <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm sm:text-lg font-semibold text-gray-600">Font Size</label>
          <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full h-10 border border-gray-300 rounded-lg">
            {[2, 5, 10, 15, 20, 25, 30, 40].map((size) => (
              <option key={size} value={size}>{size}px</option>
            ))}
          </select>
        </div>
      </div>

      <canvas ref={canvasRef} width={canvasWidth} height={400}
        className="border border-gray-400 rounded-lg shadow-lg mb-4"
        onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
      ></canvas>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-lg">
        <button className="bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition" onClick={handleClearCanvas}>Clear</button>
        <button className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition" onClick={handleSaveCanvas}>Save</button>
        <button className="bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition" onClick={handleRetrieveCanvas}>Retrieve</button>
      </div>
    </div>
  );
};

export default App;
