# Browser support

CalHeatmap is tested against a matrix of browsers, via Browserstack

The list of supported browsers is derived from `browserlist`, which covers > 90% of the global audience.

```
last 2 versions, not dead, > 0.2%
```

The strategy is to test the latest version of each browser on the latest OS,
and the oldest supported browser version on the oldest OS version possible.

| Type    | Browser          | OS                              | Latest Version | Oldest Version |
| :------ | :--------------- | :------------------------------ | :------------- | :------------- |
| Desktop | Chrome           | Windows 11                      | ✅ @latest     |                |
| Desktop | Chrome           | Windows 8                       |                | ✅ 103.0       |
| Desktop | Firefox          | Windows 11                      | ✅ @latest     |                |
| Desktop | Firefox          | Windows 8                       |                | ✅ 107.0       |
| Desktop | Edge             | Windows 11                      | ✅ @latest     |                |
| Desktop | Edge             | Windows 7                       |                | ✅ 107.0       |
| Desktop | Safari           | OS X Ventura                    | ✅ @latest     |                |
| Desktop | Safari           | OS X Big Sur                    |                | ✅ 14.0        |
| Mobile  | Chrome           | Android 12                      | ✅ @latest     |                |
| Mobile  | Chrome           | Android 5                       |                | ❌             |
| Mobile  | Samsung Internet | Android 12 (Samsung Galaxy S21) | ✅ @latest     |                |
| Mobile  | Samsung Internet | Android 7 (Samsung Galaxy S8)   |                | ❌             |
| Mobile  | Safari           | iOS 16                          | ✅ @latest     |                |
| Mobile  | Safari           |                                 |                | ❌ 12.2        |
