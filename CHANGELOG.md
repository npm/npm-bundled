# Changelog

## [5.0.0](https://github.com/npm/npm-bundled/compare/v4.0.0...v5.0.0) (2025-10-23)
### ⚠️ BREAKING CHANGES
* `npm-bundled` now supports node `^20.17.0 || >=22.9.0`
### Bug Fixes
* [`2929cfa`](https://github.com/npm/npm-bundled/commit/2929cfa28232ef065e7ebbc3305638267bfa29a5) [#113](https://github.com/npm/npm-bundled/pull/113) align to npm 11 node engine range (@owlstronaut)
### Dependencies
* [`96599e7`](https://github.com/npm/npm-bundled/commit/96599e7133f9418da9344279b962cc09e613e10d) [#113](https://github.com/npm/npm-bundled/pull/113) `npm-normalize-package-bin@5.0.0`
### Chores
* [`614df03`](https://github.com/npm/npm-bundled/commit/614df039fecb05ff763eb6ef2ab3264edd7d2129) [#113](https://github.com/npm/npm-bundled/pull/113) template-oss-apply (@owlstronaut)
* [`48ebded`](https://github.com/npm/npm-bundled/commit/48ebdedeeb10ef8d74fe76b2c01c915111b4834f) [#106](https://github.com/npm/npm-bundled/pull/106) postinstall workflow updates (#106) (@owlstronaut)
* [`f7521e3`](https://github.com/npm/npm-bundled/commit/f7521e3f10fcf106f246434a6b72f127c3e4b60f) [#111](https://github.com/npm/npm-bundled/pull/111) bump @npmcli/template-oss from 4.26.0 to 4.27.1 (#111) (@dependabot[bot], @npm-cli-bot)

## [4.0.0](https://github.com/npm/npm-bundled/compare/v3.0.1...v4.0.0) (2024-09-24)
### ⚠️ BREAKING CHANGES
* `npm-bundled` now supports node `^18.17.0 || >=20.5.0`
### Bug Fixes
* [`099af07`](https://github.com/npm/npm-bundled/commit/099af07bee7b761f2fdde4fbbd2eeba0273a6a71) [#102](https://github.com/npm/npm-bundled/pull/102) align to npm 10 node engine range (@hashtagchris)
### Dependencies
* [`5a83713`](https://github.com/npm/npm-bundled/commit/5a837133271b7d7438b80c60f705efe563693140) [#102](https://github.com/npm/npm-bundled/pull/102) `npm-normalize-package-bin@4.0.0`
### Chores
* [`9709604`](https://github.com/npm/npm-bundled/commit/970960418864bf5833857fc3a4e41e1e025fe1f8) [#102](https://github.com/npm/npm-bundled/pull/102) run template-oss-apply (@hashtagchris)
* [`fe37e08`](https://github.com/npm/npm-bundled/commit/fe37e089d7b89d87d5aaa5e15a6688d1d7124f9d) [#99](https://github.com/npm/npm-bundled/pull/99) bump @npmcli/eslint-config from 4.0.5 to 5.0.0 (@dependabot[bot])
* [`ae1bb99`](https://github.com/npm/npm-bundled/commit/ae1bb99e22bd509b53c1156decf1b9430526464c) [#100](https://github.com/npm/npm-bundled/pull/100) postinstall for dependabot template-oss PR (@hashtagchris)
* [`b211ca0`](https://github.com/npm/npm-bundled/commit/b211ca091309f78bb27575a6b4e71c9159adc46f) [#100](https://github.com/npm/npm-bundled/pull/100) bump @npmcli/template-oss from 4.23.1 to 4.23.3 (@dependabot[bot])

## [3.0.1](https://github.com/npm/npm-bundled/compare/v3.0.0...v3.0.1) (2024-05-06)

### Bug Fixes

* [`fdc7518`](https://github.com/npm/npm-bundled/commit/fdc7518448dd60931b3d96b5044486f645c9b9d0) [#87](https://github.com/npm/npm-bundled/pull/87) linting: no-unused-vars (@lukekarrys)

### Documentation

* [`aee7cab`](https://github.com/npm/npm-bundled/commit/aee7cab87960931325f9c4d9dbb39721b85b5e71) [#84](https://github.com/npm/npm-bundled/pull/84) readme: fix broken badge URL (#84) (@10xLaCroixDrinker)

### Chores

* [`e7ae896`](https://github.com/npm/npm-bundled/commit/e7ae896253c02505dbefd9ff55424447d7da4cac) [#89](https://github.com/npm/npm-bundled/pull/89) auto publish (#89) (@lukekarrys)
* [`38c91f7`](https://github.com/npm/npm-bundled/commit/38c91f79921afa1e2256a64a3a60fb9d8b6e0fa1) [#87](https://github.com/npm/npm-bundled/pull/87) bump @npmcli/template-oss to 4.22.0 (@lukekarrys)
* [`070a724`](https://github.com/npm/npm-bundled/commit/070a7247155f94496a132ade46e9d2771caef307) [#86](https://github.com/npm/npm-bundled/pull/86) create separate cwd test (@lukekarrys)
* [`240ecbd`](https://github.com/npm/npm-bundled/commit/240ecbdaf1eca2ac1332458c8d15ef33d63672f9) [#44](https://github.com/npm/npm-bundled/pull/44) deps: remove mkdirp and rimraf (#44) (@lukekarrys, @wraithgar)
* [`acfc9f4`](https://github.com/npm/npm-bundled/commit/acfc9f4f9b57c2fee38d1538cd796a94fbdf6a2c) [#87](https://github.com/npm/npm-bundled/pull/87) postinstall for dependabot template-oss PR (@lukekarrys)
* [`bbfc416`](https://github.com/npm/npm-bundled/commit/bbfc416ca26d3823d8956b684c4fbd2b74bcc8aa) [#86](https://github.com/npm/npm-bundled/pull/86) bump @npmcli/template-oss from 4.21.3 to 4.21.4 (@dependabot[bot])

## [3.0.0](https://github.com/npm/npm-bundled/compare/v2.0.1...v3.0.0) (2022-10-14)

### ⚠️ BREAKING CHANGES

* `npm-bundled` is now compatible with the following semver range for node: `^14.17.0 || ^16.13.0 || >=18.0.0`

### Features

* [`7682b9e`](https://github.com/npm/npm-bundled/commit/7682b9ef3059b92fab54a89190d8e6a7b3c25425) [#23](https://github.com/npm/npm-bundled/pull/23) postinstall for dependabot template-oss PR (@lukekarrys)

### Dependencies

* [`3a21cbe`](https://github.com/npm/npm-bundled/commit/3a21cbe987497d1830d8c382c4fa7e9e1547723b) [#30](https://github.com/npm/npm-bundled/pull/30) bump npm-normalize-package-bin from 2.0.0 to 3.0.0

## [2.0.1](https://github.com/npm/npm-bundled/compare/v2.0.0...v2.0.1) (2022-08-25)


### Dependencies

* bump npm-normalize-package-bin from 1.0.1 to 2.0.0 ([#13](https://github.com/npm/npm-bundled/issues/13)) ([aec07c1](https://github.com/npm/npm-bundled/commit/aec07c1fff4dd0690e3792c6fe00b6d7e574c017))

## [2.0.0](https://github.com/npm/npm-bundled/compare/v1.1.2...v2.0.0) (2022-08-22)


### ⚠ BREAKING CHANGES

* This adds an engine field with support for node `^12.13.0 || ^14.15.0 || >=16.0.0`.

### Documentation

* fix incorrect example of sync usage ([#9](https://github.com/npm/npm-bundled/issues/9)) ([45ccdf4](https://github.com/npm/npm-bundled/commit/45ccdf4211e0552e3957fc6dd8134a6440a803c3))


### Dependencies

* @npmcli/template-oss@3.5.0 ([#10](https://github.com/npm/npm-bundled/issues/10)) ([3ea4848](https://github.com/npm/npm-bundled/commit/3ea48487c07992c9c589ee527423ef8e3e193a7c))
