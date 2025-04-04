# oled-font-maker

This tool was inspired by the original [**OLED-js Font Foundry**](https://noopkat.github.io/oled-js-font-foundry/) created by [**Suz Hinton**](https://github.com/noopkat) for [**oled-js**](https://github.com/noopkat/oled-js). However, **oled-js** no longer compatible with the **Raspberry Pi 5**. So, I had to use migrate to one of its supported forks [`oled-rpi-i2c-bus`](https://www.npmjs.com/package/oled-rpi-i2c-bus).

This new package does not offer a tool for creating custom font modules, so I developed my own.

## Features

I have added additional features that were not present in [**OLED-js Font Foundry**](https://noopkat.github.io/oled-js-font-foundry/):

-   Real-time preview.
-   Support for regular and bold font styles.
-   Customizable letter spacing and vertical offset.
-   Customizable character sets.
-   Bounding box to display individual characters.
-   Prettify output code.
-   Buttons to download it as font file or copy data to the clipboard.
