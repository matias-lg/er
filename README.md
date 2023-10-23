## Dev environment
To install the project:
```bash
git clone https://github.com/matias-lg/er
npm install
```

build the parser:
```bash
npm run build:parser
```
run the test suite:
```bash
npm test
```
run the web app:
```bash
npm run dev
```
## Run with Docker
1. [Install Docker](https://docs.docker.com/get-docker/) on your machine.
2. Build the container: `docker build -t er-docker .`.
3. Run the container: `docker run -p 3000:3000 er-docker`.
