import * as React from "react";
import Giscus from "@giscus/react";

const id = "inject-comments";

export const Comments = () => {
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div id={id}>
      {mounted ? (
        <Giscus
          id={id}
          repo="timmypidashev/web"
          repoId="MDEwOlJlcG9zaXRvcnkzODYxMjk5Mjk="
          category="Blog & Project Comments"
          categoryId="DIC_kwDOFwPgCc4CpKtV"
          theme="https://timmypidashev.us-sea-1.linodeobjects.com/comments.css"
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          lang="en"
          loading="lazy"
        />
      ) : null}
    </div>
  );
};
