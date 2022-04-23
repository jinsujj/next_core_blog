import React from 'react'

// username/repo format
const REPO_NAME = "jinsujj/next_core_blog";

export const useUtterances = (commentNodeId: string) => {
	React.useEffect(() => {
		const scriptParentNode = document.getElementById(commentNodeId)
		if (!scriptParentNode) return

		// docs - https://utteranc.es/
		const script = document.createElement('script')
		script.src = 'https://utteranc.es/client.js'
		script.async = true
		script.setAttribute('repo', REPO_NAME)
		script.setAttribute('issue-term', 'pathname')
		script.setAttribute('label', '✨comment✨')
		script.setAttribute('theme', 'github-light')
		script.setAttribute('crossorigin', 'anonymous')

		scriptParentNode.appendChild(script)

		return () => {
			// cleanup - remove the older script with previous theme
			scriptParentNode.removeChild(scriptParentNode.firstChild as Node)
		}
	}, [commentNodeId])
};

export default useUtterances;