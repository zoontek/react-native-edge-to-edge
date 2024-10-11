# Contributing to react-native-edge-to-edge

Thank you for your interest in contributing to **react-native-edge-to-edge**! We appreciate your help in improving this project. Please follow the guidelines below to ensure a smooth contribution process.

## Code of conduct

This project and everyone participating in it is governed by the [Code of conduct](.github/CODE_OF_CONDUCT.md). By participating, you are expected to adhere to this code.

## How can I contribute?

### Reporting bugs

If you encounter any bugs or issues, please report them via [GitHub issues](https://github.com/zoontek/react-native-edge-to-edge/issues). When submitting a bug report, please ensure that you follow the provided template.

### Suggesting features

We are open to discussion! If you have a feature request, please submit it via [GitHub issues](https://github.com/zoontek/react-native-edge-to-edge/issues).

### Contributing code

We welcome pull requests! Here’s how you can contribute:

1. Fork the repository and clone your fork.
2. Create a new branch for your feature or bugfix: `git checkout -b feature/a-name`
3. Write clear and concise code, following the coding guidelines (enforced by [`prettier`](https://prettier.io/)).
4. Test your code using the [example app](./example) on both iOS and Android, and on both React Native architectures.
5. Commit your changes and push to your fork.
6. Open a pull request from your branch to the `main` branch of the main repository.

## Development workflow

### Setting up the project

1. Fork the repository and clone your fork:

```bash
git clone https://github.com/zoontek/react-native-edge-to-edge.git
```

2. Install the dependencies (using [yarn v1](https://github.com/yarnpkg/yarn)):

```bash
cd react-native-edge-to-edge
yarn install
```

3. Install the example app dependencies:

```bash
cd example
yarn install

cd ios
bundle install && bundle exec pod install
```

4. Start the app:

```bash
yarn start
```

### Running checks

We highly encourage running checks (formatting, typing, build, etc.) before committing.

```bash
yarn prepack
```

Thank you for your contributions! 🙌
