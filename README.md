# Flammel
A discord bot written with [Seyfert framework](https://github.com/tiramisulabs/seyfert).

## Getting started

First you need to clone the project and setup the environment:

```sh
# Change to the directory
cd flammel/

# Fill the .env file with ur vars
cp .env.example .env

# Create the secrets
mkdir secrets/
touch secrets/bot_token
# ...
```

### Node & npm

```sh
# ...

npm i && npm run dev
```

### Using Podman or Docker:

```sh
# ...

# Build and start the app
podman-compose build && podman-compose up -d
```

### Using Systemd+Quadlets

```sh
# ...
podman secret create flammel_bot_token ./secrets/bot_token

# Copy the container file
cp containers/systemd "$HOME/.config/containers/systemd"

# Start the service
systemctl --user daemon-reload
systemctl --user restart flammel.service
```