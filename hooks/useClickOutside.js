import React, { useEffect } from "react";

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = event => {

      if(Array.isArray(ref)){
        const componentIsClicked = ref.find(r=> !r.current || r.current.contains(event.target)) || false

        if(componentIsClicked) return
      }else{
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export default useOnClickOutside;
