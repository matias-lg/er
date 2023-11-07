## Getting Started
To install the project locally follow this steps:
### Clone the project
```bash
git clone https://github.com/matias-lg/er
```
### Install dependencies
```bash
npm install
```
### Build the ERdoc parser
```bash
npm run build:parser
```

### Run the test suite:
```bash
npm test
```
### Start the server in dev mode:
```bash
npm run dev
```
Now you can open http://localhost:3000 and the web app should be up and running.


## Run in production
### Locally
#### Make sure all tests pass and there's no lint errors
```bash
npm run test && npm run lint
```
#### Build the Next.js app
```bash
npm run build:next
```
#### Start the Node.js server
```
npm run start
```

### With Docker
1. [Install Docker](https://docs.docker.com/get-docker/) on your machine.
2. Build the container: `docker build -t er-docker .`.
3. Run the container: `docker run -p 3000:3000 er-docker`.
