import { useEffect } from "react";

export function usePageMetadata(
  title: string,
  description: string,
  canonicalPath: string,
) {
  useEffect(() => {
    document.title = title;
    const ensureMeta = (name: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(
        `meta[name="${name}"]`,
      );
      if (!element) {
        element = document.createElement("meta");
        element.name = name;
        document.head.append(element);
      }
      return element;
    };
    ensureMeta("description").content = description;
    ensureMeta("twitter:title").content = title;
    ensureMeta("twitter:description").content = description;
    const ensureProperty = (property: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(
        `meta[property="${property}"]`,
      );
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute("property", property);
        document.head.append(element);
      }
      return element;
    };
    ensureProperty("og:title").content = title;
    ensureProperty("og:description").content = description;
    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.append(canonical);
    }
    const canonicalUrl = new URL(canonicalPath, "https://earnpearls.com");
    canonical.href = canonicalUrl.toString();
    ensureProperty("og:url").content = canonicalUrl.toString();
  }, [canonicalPath, description, title]);
}

export function useStructuredData(
  id: string,
  value: Record<string, unknown> | null,
) {
  useEffect(() => {
    const elementId = `structured-data-${id}`;
    let element = document.getElementById(
      elementId,
    ) as HTMLScriptElement | null;
    if (!value) {
      element?.remove();
      return;
    }
    if (!element) {
      element = document.createElement("script");
      element.id = elementId;
      element.type = "application/ld+json";
      document.head.append(element);
    }
    element.textContent = JSON.stringify(value).replaceAll("<", "\\u003c");
    return () => element?.remove();
  }, [id, value]);
}
