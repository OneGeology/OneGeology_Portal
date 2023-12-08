# Others

## Summary

- [Styling and SASS](#styling-and-sass)
  - [SCSS Files structure](#scss-files-structure)
    - [Variables and mixins](#variables-and-mixins)
    - [Globals](#globals)
    - [Overrides](#overrides)
    - [Specifics](#specifics)
  - [Application icons](#application-icons)
- [Localization](#localization)

## Styling and SASS

OneGeology uses SASS for styling, which files are located in the [scss](../../../src/main/webapp/scss) folder of the front root. You must compile and compress the .scss files in css/styles.css before commit your changes. We recommend [koala](http://koala-app.com/) to live-compile.

**Never** edit the resulting css files directly.

### SCSS Files structure

#### Variables and mixins

[_variables.scss](../../../src/main/webapp/scss/_variables.scss) contains all colors and breakpoints used in the application style. Never use directly a color in your scss files, always reference it as variable in this file.

OneGeology use a theme system based on a class used in the body. Default is *1gg*, but you can create alternate themes by adding an array to the $themes variable, which must contains all the names used in the base theme.

    $themes: (
      1gg: (
        // common colors
        themeColor: #0093FF,
        themeDarkenColor: #02568E,
        [...]
      )
    )

[_mixins.scss](../../../src/main/webapp/scss/_mixins.scss) contains all the functions and mixins used in the scss files. It contains the themify mixin and themed function that must be used when you define colors in your style, like this: 

    body {
      @include themify($themes) {
        background: themed("mapBg");
      }
    }

With this method, the colors are picked from the theme currently applied.

#### Globals

Globals styles are the first styles to be loaded. It contains all the tag styles and simple class styles used across all styles.

#### Overrides

Loaded after the globals, the files which overrides css libraries must be named like **_libnameOverrides.scss**, where *libname* is replaced by the concerned library name.

#### Specifics

Then comes all your specific styles. It is recommended to create a scss file for each major component of the application.

### Application icons

Some of the application icons are svg created specificaly for OneGeology. Therefore, some of them must change colors in addition of their size, so it is simpler to convert them into typography characters.

To achieve that, the svg files must be monochrom (one color with transparency, preferably black) the injected in [icomoon app](https://icomoon.io/app/#/select) to transform it. The resulting font is in the *font* folder, while its classes are being generated and used in [onegicons.scss](../../../src/main/webapp/scss/onegicons.scss) which is compiled appart from styles.scss. 

Beware that your typo codes are not modified when you recreate the font files.

## Localization

To localize OneGeology texts, we use [i18next](https://www.i18next.com/) and [jquery i18next](https://github.com/i18next/jquery-i18next) library. The used language is defined in your [configuration file](configuration.md).

Each time you display a text, you must reference it like it:
- in JS files: `i18next.t('controls.overviewTitle')`
- in HTML files: `<p data-i18n="controls.baseMap"></p>`

See the libraries documentation for more details.

The localization files are in [localization](../../../src/main/webapp/localization) folder in front root. Each file is named as *lang.json* where *lang* is replaced by the language code (e.g. `en.json`).