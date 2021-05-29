# Adaptive Testing

Приложение адаптивного тестирования. Исходный код приложения находится в монорепозитории настроенном через [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)
Монорепозиторий содержит 2 пакета: [frontend](/packages/frontend) и [backend](/packages/backend).

## Необходимое ПО

-npm
-yarn
-firebase (npm package)
-serve (npm package)

## Скрипты

В корневом каталоге можно запустить следующие скрипты:

### `yarn fe start`

Запуск веб приложения для разработки\
Откройте [http://localhost:3000](http://localhost:3000) в браузере для просмотра.

Страница автоматически перезагружается при изменени кода.

### `yarn fe build`

Создает оптимизированный билд веб приложения в каталоге `build`.\
Builds the app for production to the `build` folder.\

Для запуска собранного приложения используйте скрипт `yarn webapp:serve`.

### `yarn firebase:serve`

Запуск билда серверной части приложения, после этого поднимается локальная версия firebase на [http://localhost:5000](http://localhost:5000)

### `yarn firebase:deploy`

Заливает серверный код на firebase functions

## Веб приложение

Веб приложение написано с использованием [ReactJS](https://reactjs.org/).\
Для стилей используется [Bootstrap@5.0.1](https://getbootstrap.com/).

## Серверное приложение

Серверное приложение написано на [ExpressJS](https://expressjs.com/) и развернуто на [Firebase](https://firebase.google.com/).\
Так же Firebase отвечает за авторизацию и хранение данных.
