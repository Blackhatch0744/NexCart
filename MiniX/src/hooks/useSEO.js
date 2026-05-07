/**
 * useSEO — A lightweight hook to update document head meta tags
 * Works imperatively so it doesn't require any extra library.
 *
 * Usage:
 *   useSEO({ title, description, image, url, type })
 */

import { useEffect } from "react";

const SITE_NAME = "MiniX";
const BASE_URL = "https://mini-x-pearl.vercel.app";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

function setMeta(selector, attr, value) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    const [attrName, attrValue] = selector
      .replace("meta[", "")
      .replace("]", "")
      .split("=")
      .map((s) => s.replace(/"/g, "").trim());
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setCanonical(url) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

export default function useSEO({
  title,
  description,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const canonicalUrl = url ? `${BASE_URL}${url}` : BASE_URL;

    // --- Title ---
    document.title = fullTitle;

    // --- Standard Meta ---
    setMeta('meta[name="title"]', "content", fullTitle);
    setMeta('meta[name="description"]', "content", description || "");

    // --- Canonical ---
    setCanonical(canonicalUrl);

    // --- Open Graph ---
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", description || "");
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[property="og:image"]', "content", image);
    setMeta('meta[property="og:type"]', "content", type);
    setMeta('meta[property="og:site_name"]', "content", SITE_NAME);

    // --- Twitter ---
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", description || "");
    setMeta('meta[name="twitter:url"]', "content", canonicalUrl);
    setMeta('meta[name="twitter:image"]', "content", image);
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
  }, [title, description, image, url, type]);
}
