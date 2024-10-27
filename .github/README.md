# AIHawk_Birdwatcher

> A GitHub App built with [Probot](https://github.com/probot/probot) and integrated with [OpenAI](https://platform.openai.com).  An intelligent GitHub Repository Maintainer Agent for: triaging Issues, reviewing Pull Requests, and moderating Discussions; can be trained on a repository Wiki as well for FAQ and troubleshooting, backwards compatible for existing repositories with issues, pr and discussions histories.

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t AIHawk_Birdwatcher .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> AIHawk_Birdwatcher
```

## Contributing

If you have suggestions for how AIHawk_Birdwatcher could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2024 thomHayner
