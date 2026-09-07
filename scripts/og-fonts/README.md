# OG image fonts

Static-weight instances of Inter and Fraunces, used only by
`scripts/generate-og-images.ts` to render per-entry Open Graph share
images at build time (via satori, which needs real font files rather
than the variable fonts loaded in the browser).

Instantiated from the variable fonts published in
[google/fonts](https://github.com/google/fonts) (`ofl/inter`,
`ofl/fraunces`) using `fonttools varLib.instancer`. Both are licensed
under the [SIL Open Font License 1.1](https://openfontlicense.org/),
which permits redistribution.
