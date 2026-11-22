# Avatar customization layout fix

This fork is based on upstream RoSeal 2.1.68, commit
`f3efa00b0a9b96824fa3d7c728d16785003b1750`.

RoSeal's modal stylesheet previously depended on Roblox supplying Bootstrap's
overlay positioning and dialog sizing. This fork supplies those rules within
RoSeal's own modal classes and adds the missing advanced editor column layout,
with a stacked layout on narrow screens. These address the reported inline,
stretched customization panels. The original recording's exact environment has
not been reproduced, so an extension conflict has not been ruled out.

The follow-up fix supports Roblox's React editor theme classes and obtains the
current user's ID through Roblox's authenticated users API when the legacy meta
tag is absent. This restores preview thumbnails and inventory lookups without
inventing age or subscription metadata. Scoped modal styles also supply buttons,
inputs, toggles, tabs, close controls and range tracks previously supplied by
Roblox's removed legacy stylesheet.

Validation: production Chromium builds, focused hook lint and `git diff --check`
passed. After the owner reloaded the unpacked extension, live checks confirmed
dark modal colors, worn assets, full-body and headshot previews, tab switching,
and visible thumbnail settings. Saved avatar settings were not changed; pose
submission and emote selection are not verified. Final slider track and action
glyph refinements were compiled after those live checks. A broad TypeScript
check did not finish and is not claimed as passing.

The shared range stylesheet now paints a continuous neutral track instead of a
progress gradient whose unused dark segment looked cut off. The three thumbnail
inputs were verified live at equal widths: 526px on desktop and 482px at a 600px
viewport. The narrow layout stacks correctly. The normal viewport was restored.
The same Slider component is used for asset scale and XYZ coordinates; those
consumers receive the shared style but were not separately exercised live.

The existing autocomplete now owns its opaque background, border, positioning,
stacking and scroll limit. Its height is bounded by the visible viewport and
modal; it opens upward when there is more room above. Arrow keys navigate the
suggestions and Enter chooses the highlighted item; Escape and Tab dismiss the
list. Manual ID submission remains available when no suggestion is highlighted.
Live checks confirmed containment at desktop and 600px widths, highlight changes,
keyboard scrolling to a later result (scrollTop 414), and Escape dismissal.
Pointer selection and Enter selection were not exercised because choosing an
emote saves the thumbnail pose. A pointer-wheel attempt did not move the list;
wheel scrolling is not claimed as verified. The normal viewport was restored.
The shared component also serves asset, user and tracking-exception lookups;
those consumers were inspected in source but not separately tested live.

## Load the unpacked Chromium extension

1. Extract the ZIP to a permanent folder.
2. Open your browser's extensions page (`brave://extensions`,
   `chrome://extensions`, or `edge://extensions`).
3. Disable the store-installed RoSeal to prevent duplicate execution. Keep it
   installed so its existing settings remain available.
4. Enable Developer mode, choose **Load unpacked**, and select the extracted
   folder containing `manifest.json`.
5. Refresh Roblox's avatar editor, open **Advanced Customization**, and select
   **Thumbnails Customization**.

The unpacked extension may have separate settings from the store extension.
To revert, disable the unpacked copy and re-enable the store copy. Other Roblox
extensions can remain enabled initially; if the layout still fails, test with
those extensions temporarily disabled to isolate a conflict.

## Source and license

Upstream: https://github.com/RoSeal-Extension/RoSeal

Modified source: https://github.com/glumly/RoSeal

RoSeal remains copyright its upstream authors and licensed under AGPL-3.0.
Retain the included LICENSE and make this fork's corresponding source available
when sharing modified builds. This is an unofficial fork, not a store release.

Build with Bun using `bun install --frozen-lockfile`, then
`bun ./scripts/build.ts --target chrome --release`.
