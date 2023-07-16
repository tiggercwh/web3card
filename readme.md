# Web3 Card Component

## Getting Started

- Clone the repository and install the dependencies. (This project uses pnpm as default)
- Run `pnpm dev`
- Make sure you have Metamask extension installed in chrome

## Dependencies

Major Dependencies: React, Typescript and ethers.js

Other than those , this project uses:

1. shadcn/ui for basic components
2. tailwindcss
3. usehooks-ts
   \*\* Note that these listed dependencies are just used in order to have development focus on the component logic.
   These dependencies can be replaced/removed without affecting core functionality.

## Description

The following lists out the supporting pieces of the component:
| Folder | Description |
| -------------- | --------------------------------------------- |
| `/src/components` | Some lightly styled components for basic ui |
| `/src/lib/content` | Contains the layout of the card|
| `/src/lib/hooks` | Contains the hook which handles the logic for the card |

## To be done:

Bug exists and some good-to-have feature is still missing, here are some of them:

1. Avatar is not available yet (Now only showing eth icon for default)
2. After page refresh, signing message will not display the public key (Local storage not storing the key)
3. Some more responsiveness (Avatar size etc.)
4. Very limited typing currently
5. Some refinements can be done in the sense that many functions called too often, such as getting the provider
