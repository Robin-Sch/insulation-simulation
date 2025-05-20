# Insulation Simulation

This is a simple project that shows different types of (waste) insulation and their performance. You can view it live [here](https://insulation.robinsch.net), or you can run this on your own server using the steps below.


### Development

First, run the development server using `npm run dev`, then open [http://localhost:3000](http://localhost:3000) with your bwoser to see the website.

You can start editing the page by modifiying `app/page.tsx`. This page auto-updates as you edit the file.


### Deployment

Download the `compose.yml` file from this repo, make sure to edit the ports (if needed). After that, start the docker container using

```
docker compose up -d
```
