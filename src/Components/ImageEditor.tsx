import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer, Rect } from "react-konva";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom"; // Update this line

interface ImageProps {
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement;
  id: string;
  rotation?: number; // Added rotation property
}

const ImageComponent: React.FC<{
  shapeProps: ImageProps;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: ImageProps) => void;
}> = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected) {
      trRef.current?.nodes([shapeRef.current!]);
      trRef.current?.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = (e: any) => {
    onChange({
      ...shapeProps,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = (e: any) => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Reset scale
    node.scaleX(1);
    node.scaleY(1);

    onChange({
      ...shapeProps,
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
      rotation: node.rotation(), // Get rotation angle
    });
  };

  return (
    <>
      {isSelected && (
        <Rect
          x={shapeProps.x}
          y={shapeProps.y}
          width={shapeProps.width}
          height={shapeProps.height}
          stroke="blue"
          strokeWidth={4}
          listening={false}
        />
      )}
      <KonvaImage
        ref={shapeRef}
        {...shapeProps}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox: any, newBox: any) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<any>(null);
  const [thumbnails, setThumbnails] = useState<{ id: string; src: string }[]>([]);
  console.log(thumbnails,"thumbnails");
  
  const [imageCount, setImageCount] = useState(0);
  console.log(imageCount)
  const navigate = useNavigate(); // Update to useNavigate

  const handleImageUpload = (files: FileList) => {
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new window.Image();
          img.src = reader.result as string;
          img.onload = () => {
            setImageCount((prevCount) => {
              const newId = `image${prevCount + 1}`;
              setThumbnails((prev) => {
                const newThumbnails = [...prev, { id: newId, src: img.src }];
                // Set the first image in the editor if thumbnails are available
                if (newThumbnails.length === 1) {
                  const newImage: ImageProps = {
                    x: (800 - 200) / 2,
                    y: (600 - 200) / 2,
                    width: 200,
                    height: 200,
                    image: img,
                    id: newId,
                    rotation: 0,
                  };
                  setImage(newImage);
                }
                return newThumbnails;
              });
              return prevCount + 1;
            });
          };
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleThumbnailSelect = (id: string) => {
    const selectedThumbnail = thumbnails.find((thumb) => thumb.id === id);
    if (selectedThumbnail) {
      const img = new window.Image();
      img.src = selectedThumbnail.src;
      img.onload = () => {
        const newImage: ImageProps = {
          x: (800 - 200) / 2,
          y: (600 - 200) / 2,
          width: 200,
          height: 200,
          image: img,
          id: selectedThumbnail.id,
          rotation: 0,
        };
        setImage(newImage);
      };
    }
  };
console.log(image,"image");

  // const handleCartClick = () => {
  //   navigate('/cart', { state: { image } }); 
  // };
  // const imageSrc = image; // or whatever property you need
  console.log(image,"image");
//   const handleCartClick = () => {
//     // Assuming `image` is the HTMLImageElement, extract its src or other properties
//     const imageSrc = image.currentSrc; // or whatever property you need
    
//     navigate('/cart', { state: { image } });
// };
const removeImage = (id: string) => {
  setThumbnails((prev) => prev.filter((thumb) => thumb.id !== id));

  // Optionally, if the removed image is the currently displayed image, reset it
  if (image?.id === id) {
    setImage(null); // or set to another image if needed
  }
};
const handleCartClick = () => {
  navigate('/cart', {
      state: {
          image: {
              src: image.image.currentSrc, // image URL
              id: image.id,   // any ID you have
              width: image.width, // or use a method to get width
              height: image.height, // or use a method to get height
              rotation: image.rotation, // the rotation degree
          },
      },
  });
};
  return (
    <>
   
    <div style={{ display: 'flex', gap: '20px', padding: '80px' }} className="flexWrapper">
  {/* Left Section (Image Editor Canvas) */}
  <div style={{border: '1px solid #f1f1f1', position: 'relative', padding: '10px',borderRadius:"15px" }} className="leftWrapper" >
  <Stage className="canvaWidth"
        width={1200}
        height={600}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            // Prevent deselecting image
          }
        }}
        onTouchStart={(e) => {
          if (e.target === e.target.getStage()) {
            // Prevent deselecting image
          }
        }}
      >
        <Layer>
          {image && (
            <ImageComponent
              key={image.id}
              shapeProps={image}
              isSelected={true}
              onSelect={() => setImage(image)}
              onChange={(newAttrs) => {
                setImage(newAttrs);
              }}
            />
          )}
        </Layer>
      </Stage>
  </div>

  {/* Right Section (Options and Thumbnails) */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} className="rightWrapper">
    {/* Mouse Pad Size Selector */}
    <div>
      <h2 className="headingText">Mouse Pad Size</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="sizeButton">700x300</button>
        <button className="sizeButton">900x400</button>
      </div>
    </div>

    {/* Image Upload Section */}
    <label style={{ display: 'block', cursor: 'pointer' }}>
  <input 
    type="file" 
    accept="image/*" 
    multiple 
    onChange={(e:any) => handleImageUpload(e.target.files)} 
    style={{ display: 'none' }} // Hide the input
  />
  <div 
    className="placeholderDuv"
    onDrop={handleFileDrop}
    onDragOver={handleDragOver}
  >
    <div>
    <h3>Your Design Here</h3>
    <p style={{ color: '#888' }}>Drag and Drop</p>
    <p style={{ color: '#bbb', fontSize: 'small' }}>
      PNG, JPG, PDF, JPEG, AI, EPS, HEIC
    </p>
    </div>
    
    {/* Thumbnail Section */}
  </div>
</label>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' }}>
        {thumbnails.map((thumb) => (
          <div style={{ position: 'relative' }}>
            <img
              key={thumb.id}
              src={thumb.src}
              alt={thumb.id}
              style={{ width:120, height: 120, borderRadius: '5px', cursor: 'pointer' }}
              onClick={() => handleThumbnailSelect(thumb.id)}
            />
      
            <button
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: 'red',
                color: 'white',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={() => removeImage(thumb.id)}
            >
              X
            </button>
          </div>
        ))}
      </div>

    {/* Resize Section */}
    {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
      <input type="text" placeholder="Width" style={{ width: '70px', padding: '5px' }} />
      <input type="text" placeholder="Height" style={{ width: '70px', padding: '5px' }} />
      <button style={{ padding: '5px 15px', background: '#ff4d4f', color: 'white', border: 'none' }}>
        Resize
      </button>
    </div> */}

    {/* Rotate/Undo Section */}
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' }}>
      <button className="sizeButton">⟲ Rotate</button>
      <button className="sizeButton">↺ Undo</button>
    </div>

    {/* Add to Cart Button */}
    <div style={{ textAlign: 'center', }}>
      <button onClick={handleCartClick} className="cartBtn">
        Add to Cart
      </button>
    </div>
  </div>
</div>
</>

  );
};

export default ImageEditor;
