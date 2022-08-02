import React, { useEffect } from 'react';
import Prism from 'prismjs';


export default function Code({ code, language }:any) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);
  return (
    <div className='Code'>
      <pre>
        <code className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}