import { useEffect, useState } from "react";

const TypingText = ({ text = "", speed = 30, onDone }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        if (!text) {
            return;
        }
    
        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText((prev) => prev + text[index]);
                index++;
            } else {
                clearInterval(interval);
                if (onDone) onDone();
            }
        }, speed);
    
        return () => clearInterval(interval);
    }, [text]);
    

    return <span>{displayedText}<span className="animate-pulse">|</span></span>;

};

export default TypingText;
