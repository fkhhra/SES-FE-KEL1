import swal from "@sweetalert/with-react";
import { apiURL } from "client/clientAxios";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";

const CanvasDraw = ({ id, img, handleSave, disableSave = false }) => {
  var canvas,
    context,
    flag,
    prevX,
    prevY,
    currX,
    currY,
    dot_flag,
    width,
    height;
  var x = "black",
    y = 2;

  const [image, setImage] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    canvas = document.getElementById(id);
    context = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;

    if (img) {
      const image = new Image();
      image.onload = () => {
        setImage(image);
        setLoading(false);
        height = (width * image.height) / image.width;
        canvas.height = height;
        canvas.style.display = "block";
        context.drawImage(image, 0, 0, width, height);
      };
      image.src = `${apiURL}/image?url=${img}`;
    }
  }, [img]);

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width,
      scaleY = canvas.height / rect.height;
    currY = (evt.clientY - rect.top) * scaleY;
    currX = (evt.clientX - rect.left) * scaleX;
  }

  function draw() {
    canvas = document.getElementById(id);
    context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo(prevX, prevY);
    context.lineTo(currX, currY);
    context.strokeStyle = x;
    context.lineWidth = y;
    context.stroke();
    context.closePath();
  }

  function findxy(res, e) {
    canvas = document.getElementById(id);
    context = canvas.getContext("2d");
    if (res == "down") {
      prevX = currX;
      prevY = currY;
      getMousePos(canvas, e);

      flag = true;
      dot_flag = true;
      if (dot_flag) {
        context.beginPath();
        context.fillStyle = x;
        context.fillRect(currX, currY, 2, 2);
        context.closePath();
        dot_flag = false;
      }
    }
    if (res == "up" || res == "out") {
      flag = false;
    }
    if (res == "move") {
      if (flag) {
        prevX = currX;
        prevY = currY;
        getMousePos(canvas, e);

        draw();
      }
    }
  }

  function drawImage() {
    canvas = document.getElementById(id);
    context = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;
    context.drawImage(image, 0, 0, width, (width * image.height) / image.width);
  }

  function clear() {
    canvas = document.getElementById(id);
    context = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;
    const willDelete = confirm("Yakin ingin dihapus?");
    if (willDelete) {
      context.clearRect(0, 0, width, height);
      if (img) {
        drawImage();
      }
    }
  }

  const save = () => {
    canvas = document.getElementById(id);
    var dataURL = canvas.toDataURL();
    if (handleSave) {
      handleSave(dataURL);
    } else {
      //   document.getElementById("canvasimg").src = dataURL;
    }
  };
  return (
    <div id={`editor-${id}`}>
      {loading ? (
        <div className="w-100 rounded-ss">
          <Skeleton width={"100%"} height={75} className="rounded-ss mb-3" />
          <Skeleton width={"100%"} height={75} className="rounded-ss mb-3" />
          <Skeleton width={"100%"} height={75} className="rounded-ss mb-3" />
        </div>
      ) : null}
      <div className="d-flex">
        <canvas
          id={id}
          //   width={400}
          //   height={400}
          style={{
            border: "1px solid black",
            display: "none",
            marginRight: "1rem",
          }}
          onMouseMove={(e) => findxy("move", e)}
          onMouseDown={(e) => findxy("down", e)}
          onMouseUp={(e) => findxy("up", e)}
          onMouseOut={(e) => findxy("out")}
          className="w-100"
        ></canvas>
      </div>
      <div className="d-flex justify-content-end mt-3">
        <button className="btn btn-ss btn-outline-primary btn-outline-primary-ss rounded-pill me-3" onClick={clear}>
          Hapus
        </button>
        <button
          className="btn btn-ss btn-primary btn-primary-ss rounded-pill shadow-primary-ss"
          onClick={() => save()}
          disabled={disableSave}
        >
          Simpan
        </button>
      </div>
    </div>
  );
};

export default CanvasDraw;
