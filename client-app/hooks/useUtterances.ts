import React from "react";
import { useSelector } from "../store";
import common, { commonAction } from "../store/common";

// username/repo format
const REPO_NAME = "jinsujj/next_core_blog";

export const useUtterances = (commentNodeId: string) => {
  const isDarkMode = useSelector((state) => state.common.isDark);

  React.useEffect(() => {
    const loadUtterancesScript = () => {
      const scriptParentNode = document.getElementById(commentNodeId);
      if (!scriptParentNode) return;

      // Remove previous script if exists
      while (scriptParentNode.firstChild) {
        scriptParentNode.removeChild(scriptParentNode.firstChild);
      }

      // Load Utterances script
      const script = document.createElement("script");
      script.src = "https://utteranc.es/client.js";
      script.async = true;
      script.setAttribute("repo", REPO_NAME);
      script.setAttribute("issue-term", "pathname");
      script.setAttribute("label", "✨comment✨");
      script.setAttribute("crossorigin", "anonymous");
      script.setAttribute("theme", isDarkMode ? "github-dark" : "github-light");
      scriptParentNode.appendChild(script);
    };

    // Delay script loading to ensure DOM readiness
    const timer = setTimeout(loadUtterancesScript, 1000);
    return () => clearTimeout(timer);
  }, [commentNodeId, isDarkMode]);
};

export default useUtterances;
