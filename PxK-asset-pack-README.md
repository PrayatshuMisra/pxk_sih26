# PxK Asset Pack

This folder contains the original visual assets referenced by the PxK web application. They are intentionally stored outside the application source directory so that managed deployment remains reliable and the application can refer to stable hosted paths.

| File | PxK use | Hosted project path |
|---|---|---|
| `pxk-route-mark.png` | Primary route-mark logo | `/manus-storage/pxk-route-mark_e4cd9c8c.png` |
| `pxk-hero-phone.png` | Home-page hero interface visual | `/manus-storage/pxk-hero-phone_0446e360.png` |
| `pxk-profile-sheet.png` | Structured screening profile visual | `/manus-storage/pxk-profile-sheet_2d4eecf8.png` |
| `pxk-doctor-match.png` | Specialist matching visual | `/manus-storage/pxk-doctor-match_49f8757f.png` |
| `pxk-monitoring-route.png` | Patient monitoring visual | `/manus-storage/pxk-monitoring-route_950aeb70.png` |
| `pxk-route-mark_original.png` | Original route-mark variation | Not referenced by the current application |

## Using the assets after downloading the project

Download **both** the project source ZIP and `PxK-asset-pack.zip`. If you run the project outside the managed environment, copy the image files to your preferred static asset directory and update the entries in `client/src/data/mockData.ts` to use local URLs such as `/assets/pxk-hero-phone.png`.

The project currently uses the hosted paths shown above so its deployed preview remains lightweight. The asset pack is the portable local-copy companion to the source ZIP.
