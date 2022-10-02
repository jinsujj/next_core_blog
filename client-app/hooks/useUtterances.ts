import React from "react";
import { useSelector } from "../store";
import common, { commonAction } from "../store/common";

// username/repo format
const REPO_NAME = "jinsujj/next_core_blog";

export const useUtterances = (commentNodeId: string) => {
  const isDarkMode = useSelector((state) => state.common.isDark);

  React.useEffect(() => {
    const scriptParentNode = document.getElementById(commentNodeId);
    if (!scriptParentNode) return;

    // docs - https://utteranc.es/
    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.async = true;
    script.setAttribute("repo", REPO_NAME);
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("label", "✨comment✨");
    script.setAttribute("crossorigin", "anonymous");
    if (isDarkMode) {
      script.setAttribute("theme", "github-dark");
    } else {
      script.setAttribute("theme", "github-light");
    }

    scriptParentNode.appendChild(script);

    return () => {
      // cleanup - remove the older script with previous theme
      scriptParentNode.removeChild(scriptParentNode.firstChild as Node);
    };
  }, [commentNodeId]);
};

export default useUtterances;
