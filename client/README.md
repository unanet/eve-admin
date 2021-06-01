# eve-admin

Project heavily references while setting up the boiler plate code [Vue Soft UI](https://github.com/Kamona-WD/kwd-dashboard)

Quick Setup
===
* `yarn install`
* `npm install sass -g`. You will need to enable file watchers for scss to css converting
* `vue ui`
  * Click `import project` import `/client`
  * Navigate to Tasks > Serve. Then click "Run Task". This will compile and start up the UI
* If you want to run the API as well ( in order to run this with the API server, goland has debug configurations )

Helpful links
===
* [Vue Structure](https://itnext.io/how-to-structure-my-vue-js-project-e4468db005ac)

Helpful Ramp up information
===
In order to speed up development, I added the theme into `client/_theme` folder. In order to get a good idea of what the
theme looks / acts like, we can open up the `index.html`, `index2.html`, `index3.html` or `starter.html`. We can then copy and paste the 
markup out and into our view components

* `src/components` = UI components / self contained pieces
* `src/layouts` = Page Layouts like Admin or Guest
* `src/views` = Logical pages


Vue Docs:
===
* [props](https://v3.vuejs.org/api/options-data.html#props)
* [Data](https://v3.vuejs.org/api/options-data.html#data-2)

Yarn Setup
===

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Run your end-to-end tests
```
yarn test:e2e
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### Theme Ideas
* [Soft UI Dashboard](https://github.com/gentritabazi01/Vue-Soft-UI-Dashboard)
    * [Github link](https://github.com/Kamona-WD/kwd-dashboard)
* [Vue Notus](https://www.creative-tim.com/product/vue-notus?ref=vn-index&_ga=2.188296360.1665515708.1619645805-1717903657.1619645805)
* [AdminLTE](https://adminlte.io/themes/AdminLTE/index2.html)
* [Tailwind CSS](https://tailwindcss.com/)
