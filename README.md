# travel-regulations

This repository is for creating a google cloud server that can pull in travel restriction data and save it in firestore database.

## Setup

Get firebase cli. This is required for local development

```
npm i -g firebase-tools
```

Install dependencies.

```
cd functions/
yarn
```

## Development

```
cd functions/
yarn serve
```

http endpoint will be hosted at http://localhost:5001/covid-border/us-central1/syncTravelRegulations
