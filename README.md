# R-Archive

## Local development

In project directory run

```
npx arlocal
```

To run local arweave gateway and then run to run R-Archive

```
npm start
```

If you're running fresh project run `npm install`

## Deployment and running deployment build locally

```
npm build
npx serve -l 3001 dist
```

## Known Issues

### Unable to upload transaction: 410

Add funds

```
fetch(`http://localhost:1984/mint/${address}/1000000000000000`)
```

Try again
