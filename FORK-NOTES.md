# Avatar customization layout fix

This fork is based on upstream RoSeal 2.1.68, commit
`f3efa00b0a9b96824fa3d7c728d16785003b1750`.

RoSeal's modal stylesheet previously depended on Roblox supplying Bootstrap's
overlay positioning and dialog sizing. This fork supplies those rules within
RoSeal's own modal classes and adds the missing advanced editor column layout,
with a stacked layout on narrow screens. These address the reported inline,
stretched customization panels. The original recording's exact environment has
not been reproduced, so an extension conflict has not been ruled out.

Validation: the upstream production Chromium build succeeded and `git diff
--check` passed. No live Roblox avatar API save or browser acceptance test has
been completed. Browser automation stopped because it could not determine the
current browser URL reliably. The installed extensions were not changed.

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
