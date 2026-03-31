import { ANIMATION_IDS, DEFAULT_ANIMATION_ID } from "@/lib/animations";

const VALID_IDS = JSON.stringify(ANIMATION_IDS);

export const ANIMATION_LOADER_SCRIPT = `(function(){var id=localStorage.getItem("animation");if(id&&${VALID_IDS}.indexOf(id)!==-1)document.documentElement.dataset.animation=id;else document.documentElement.dataset.animation="${DEFAULT_ANIMATION_ID}";})();`;

export const ANIMATION_NAV_SCRIPT = `document.addEventListener("astro:after-navigation",function(){var id=localStorage.getItem("animation");if(id&&${VALID_IDS}.indexOf(id)!==-1)document.documentElement.dataset.animation=id;else document.documentElement.dataset.animation="${DEFAULT_ANIMATION_ID}";});`;
