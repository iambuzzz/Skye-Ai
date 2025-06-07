import React from "react";
import { TypeAnimation } from "react-type-animation";

const TypingAnim = () => {
  return (
    <TypeAnimation
      sequence={[
        'Chat with your AI Assistant',
        1000,
        'Powered by Google Gemini Pro',
        1000,
        'Built with React & TypeScript',
        1000,
        'Secure. Fast. Intelligent.',
        1000,
      ]}
      className="responsive-text"
      wrapper="span"
      speed={60}
      deletionSpeed={60}
      style={{ display: 'inline-block', color: 'white', textShadow:"1px 1px 20px #00fffc", textAlign:"center"}}
      repeat={Infinity}
    />
  );
};

export default TypingAnim;
