# oled-font-maker

This tool was inspired by the original [**OLED-js Font Foundry**][OLEDFF] created by [**Suz Hinton**][NOOPKAT] for [**oled-js**][OLEDJS]. However, **oled-js** is no longer compatible with the **Raspberry Pi 5**. So, I had to use one of its supported forks [`oled-rpi-i2c-bus`][OLEDRPI].

This new package does not offer a tool for creating custom font modules, so I developed my own.

🚀 [**Try it here**](https://shadowshahriar.github.io/oled-font-maker/)

## Features

I have added additional features that were not present in the [**OLED-js Font Foundry**][OLEDFF]:

-   Real-time preview.
-   Support for regular and bold font styles.
-   Customizable letter spacing and vertical offset.
-   Customizable character sets.
-   Bounding box to display individual characters.
-   Prettify output code.
-   Buttons to download it as font file or copy data to the clipboard.

# License

The source code is licensed under the [**MIT License**][LICENSE].

<!-- === links === -->

[OLEDFF]: https://noopkat.github.io/oled-js-font-foundry/
[OLEDJS]: https://github.com/noopkat/oled-js
[OLEDRPI]: https://www.npmjs.com/package/oled-rpi-i2c-bus
[NOOPKAT]: https://github.com/noopkat
[LICENSE]: ./LICENSE
