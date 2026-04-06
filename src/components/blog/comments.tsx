import * as React from "react";
import Giscus from "@giscus/react";
import { getStoredThemeId } from "@/lib/themes/engine";

const id = "inject-comments";

function getThemeUrl(themeId: string): string {
  // Giscus iframe needs a publicly accessible URL — always use production domain
  return `https://timmypidashev.dev/api/giscus-theme?theme=${themeId}`;
}

export const Comments = () => {
  const [mounted, setMounted] = React.useState(false);
  const [themeUrl, setThemeUrl] = React.useState("");

  React.useEffect(() => {
    setThemeUrl(getThemeUrl(getStoredThemeId()));
    setMounted(true);

    const handleThemeChange = () => {
      const newUrl = getThemeUrl(getStoredThemeId());
      setThemeUrl(newUrl);

      // Tell the giscus iframe to update its theme
      const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(
          { giscus: { setConfig: { theme: newUrl } } },
          "https://giscus.app"
        );
      }
    };

    document.addEventListener("theme-changed", handleThemeChange);
    return () => document.removeEventListener("theme-changed", handleThemeChange);
  }, []);

  return (
    <div id={id} className="mt-8">
      {mounted && themeUrl ? (
        <Giscus
          id={id}
          repo="timmypidashev/web"
          repoId="MDEwOlJlcG9zaXRvcnkzODYxMjk5Mjk="
          category="Blog & Project Comments"
          categoryId="DIC_kwDOFwPgCc4CpKtV"
          theme={themeUrl}
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          lang="en"
          loading="eager"
        />
      ) : null}
    </div>
  );
};
