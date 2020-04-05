# node-phenix

An API wrapper for the anti-waste app [Phenix](https://wearephenix.com)

## Installation

```shell
yarn add node-phenix
```

## Usage

```javascript
const Phenix = require("node-phenix");
const phenix = new Phenix({
  email: "",
  password: "",
});
```

## Methods

### Login

```javascript
await phenix.login();
```

### Get profile

```javascript
await phenix.getProfile();
```

### Get nearby stores (+items)

```javascript
await phenix.getStores({ latitude, longitude }, radius = 2000);
```
